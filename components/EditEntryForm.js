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
  // loading | signedOut | notFound | notOwner | ready
  const [status, setStatus] = useState("loading");
  const [entryId, setEntryId] = useState("");
  const [existingPhoto, setExistingPhoto] = useState("");
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
          .select(`${ENTRY_COLUMNS}, owner`)
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
      setError(
        "That file isn't an image — videos and other files are not accepted."
      );
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhoto(null);
      setError("The photo is too large — 5 MB or smaller, please.");
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
        setError("Please sign in first.");
        return;
      }

      // Renaming into an existing entry's title or Khmer name is not allowed.
      const duplicate = await findDuplicateEntry(supabase, {
        title: cleaned.nameEnglish,
        nameKhmer: cleaned.nameKhmer,
        excludeId: entryId,
      });
      if (duplicate) {
        setError("An entry with this name already exists in the archive.");
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
          setError("The photo could not be uploaded. Please try again.");
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

      const { error: updateError } = await supabase
        .from("entries")
        .update(row)
        .eq("id", entryId);

      if (updateError) {
        if (uploadedPath) {
          await supabase.storage.from("entry-images").remove([uploadedPath]);
        }
        setError("We could not save your changes. Please try again.");
        return;
      }

      // The photo was replaced successfully — remove the old file so storage
      // doesn't collect orphans.
      if (uploadedPath && oldStoragePath) {
        await supabase.storage.from("entry-images").remove([oldStoragePath]);
      }

      router.push(`/games/${slug}`);
    } catch {
      if (uploadedPath) {
        await supabase.storage.from("entry-images").remove([uploadedPath]);
      }
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <p className={styles.notice}>Loading your entry…</p>;
  }

  if (status === "signedOut") {
    return (
      <p className={styles.notice}>
        Please{" "}
        <Link href="/login" className={styles.switchLink}>
          sign in
        </Link>{" "}
        to edit your entries.
      </p>
    );
  }

  if (status === "notOwner") {
    return (
      <p className={styles.notice}>
        You can only edit entries you created yourself.{" "}
        <Link href="/my-entries" className={styles.switchLink}>
          Back to my entries
        </Link>
      </p>
    );
  }

  if (status === "notFound") {
    return (
      <p className={styles.notice}>
        That entry doesn&rsquo;t exist.{" "}
        <Link href="/" className={styles.switchLink}>
          Back to the archive
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
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          disabled={busy}
          onClick={() => router.push("/my-entries")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}