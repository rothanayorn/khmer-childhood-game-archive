"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ENTRY_COLUMNS,
  toGame,
  toEntryRow,
  findDuplicateEntry,
  pickUniqueSlug,
  storagePathFromUrl,
} from "@/lib/entries";
import { validateEntry, MAX_PHOTO_BYTES } from "@/lib/entryForm";
import EntryFields from "./EntryFields";
import { useI18n } from "./I18nProvider";
import styles from "./EntryForm.module.css";

const EMPTY_FIELDS = {
  nameKhmer: "",
  nameEnglish: "",
  tagline: "",
  description: "",
  stepsText: "",
  players: "",
  materials: "",
  contributor: "",
  place: "",
};

export default function EditEntryForm({ slug }) {
  const router = useRouter();
  const { t } = useI18n();
  // loading | signedOut | notFound | notOwner | ready
  const [status, setStatus] = useState("loading");
  const [entryId, setEntryId] = useState("");
  const [existingPhoto, setExistingPhoto] = useState("");
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  function setField(name, value) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(async ({ data: authData, error: authError }) => {
        if (authError || !authData.user) {
          setStatus("signedOut");
          return;
        }
        const { data: rows, error: loadError } = await supabase
          .from("entries")
          // `id` is required here: it becomes the `excludeId` for the
          // duplicate check and the WHERE target for the update. Without it,
          // the row being edited is treated as its own duplicate.
          .select(`id, ${ENTRY_COLUMNS}, owner`)
          .eq("slug", slug)
          .limit(1);
        if (loadError || !rows || rows.length === 0) {
          setStatus("notFound");
          return;
        }
        const row = rows[0];
        // Only the owner can edit — RLS enforces this too; the check here is
        // so the page can say so plainly instead of showing a broken form.
        if (row.owner !== authData.user.id) {
          setStatus("notOwner");
          return;
        }
        const game = toGame(row);
        setEntryId(row.id);
        setExistingPhoto(row.photo_url ?? "");
        setPreviewUrl(row.photo_url ?? "");
        setFields({
          nameKhmer: game.nameKhmer ?? "",
          nameEnglish: game.nameEnglish ?? "",
          tagline: game.tagline ?? "",
          description: game.description ?? "",
          stepsText: (game.steps ?? []).join("\n"),
          players: game.players ?? "",
          materials: game.materials ?? "",
          contributor: game.contributor ?? "",
          place: game.place ?? "",
        });
        setStatus("ready");
      })
      .catch(() => setStatus("signedOut"));
  }, [slug]);

  function onPhotoChange(event) {
    const file = event.target.files && event.target.files[0];
    setError("");
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(existingPhoto);

    if (!file) {
      setPhoto(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhoto(null);
      setError(t("validation.fileNotImage"));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhoto(null);
      setError(t("validation.fileTooLarge"));
      return;
    }
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // The photo is optional while editing: keep the current one unless a new
    // file was chosen.
    const { error: problem, cleaned } = validateEntry(fields, photo, {
      photoRequired: false,
    });
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setBusy(true);
    const supabase = createClient();
    let uploadedPath = "";
    const oldStoragePath = storagePathFromUrl(existingPhoto);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        setError(t("editPage.signInFirst"));
        return;
      }

      // Renaming into an existing entry's title or Khmer name is not allowed.
      const duplicate = await findDuplicateEntry(supabase, {
        title: cleaned.nameEnglish,
        nameKhmer: cleaned.nameKhmer,
        excludeId: entryId,
      });
      if (duplicate) {
        setError(t("editPage.duplicate"));
        return;
      }

      let photoUrl = existingPhoto;
      if (photo) {
        const ext = (photo.name.split(".").pop() || "jpg").toLowerCase();
        uploadedPath = `entries/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("entry-images")
          .upload(uploadedPath, photo, { contentType: photo.type });
        if (uploadError) {
          uploadedPath = "";
          setError(t("editPage.photoFail"));
          return;
        }
        const { data: urlData } = supabase.storage
          .from("entry-images")
          .getPublicUrl(uploadedPath);
        photoUrl = urlData.publicUrl;
      }

      const slug = await pickUniqueSlug(supabase, cleaned.nameEnglish, entryId);

      const row = toEntryRow({
        ...cleaned,
        photoUrl,
        slug,
        owner: authData.user.id,
      });
      delete row.owner; // ownership never changes when editing

      // Saving an edit sends the entry back to pending review, unless the
      // current user is a reviewer (decided by the project's existing RPC).
      // If the RPC call fails, treat the user as a regular contributor so the
      // entry stays pending rather than silently skipping review.
      let isReviewer = false;
      try {
        const { data: reviewer } = await supabase.rpc("is_reviewer");
        isReviewer = reviewer === true;
      } catch {
        isReviewer = false;
      }
      if (!isReviewer) {
        row.status = "pending";
      }

      const { error: updateError } = await supabase
        .from("entries")
        .update(row)
        .eq("id", entryId);

      if (updateError) {
        if (uploadedPath) {
          await supabase.storage.from("entry-images").remove([uploadedPath]);
        }
        setError(t("editPage.saveFail"));
        return;
      }

      // The photo was replaced successfully — remove the old file so storage
      // doesn't collect orphans.
      if (uploadedPath && oldStoragePath) {
        await supabase.storage.from("entry-images").remove([oldStoragePath]);
      }

      setSaved(true);
      setTimeout(() => router.push(`/games/${slug}`), 1200);
    } catch {
      if (uploadedPath) {
        await supabase.storage.from("entry-images").remove([uploadedPath]);
      }
      setError(t("editPage.unknown"));
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <p className={styles.notice}>{t("editPage.loading")}</p>;
  }

  if (status === "signedOut") {
    return (
      <p className={styles.notice}>
        <Link href="/login" className={styles.switchLink}>
          {t("nav.logIn")}
        </Link>{" "}
        {t("editPage.signInRest")}
      </p>
    );
  }

  if (status === "notOwner") {
    return (
      <p className={styles.notice}>
        {t("editPage.notOwner")}{" "}
        <Link href="/my-entries" className={styles.switchLink}>
          {t("editPage.backMyEntries")}
        </Link>
      </p>
    );
  }

  if (status === "notFound") {
    return (
      <p className={styles.notice}>
        {t("editPage.notFound")}{" "}
        <Link href="/" className={styles.switchLink}>
          {t("editPage.backArchive")}
        </Link>
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <EntryFields
        values={fields}
        onChange={setField}
        onPhotoChange={onPhotoChange}
        previewUrl={previewUrl}
        photoRequired={false}
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={busy}>
          {busy ? t("editPage.saving") : t("editPage.save")}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          disabled={busy}
          onClick={() => router.push("/my-entries")}
        >
          {t("editPage.cancel")}
        </button>
      </div>

      {saved && (
        <p className={styles.success} role="status">
          {t("editPage.saved")}
        </p>
      )}
    </form>
  );
}