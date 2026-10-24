"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import EntryFields from "./EntryFields";
import {
  toEntryRow,
  findDuplicateEntry,
  pickUniqueSlug,
} from "@/lib/entries";
import { useI18n } from "./I18nProvider";
import { validateEntry, MAX_PHOTO_BYTES } from "@/lib/entryForm";
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

export default function EntryForm() {
  const router = useRouter();
  const { t } = useI18n();
  // Only authenticated users may submit; the form is a no-op otherwise.
  const [authGate, setAuthGate] = useState("loading"); // loading | signedIn | signedOut

  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function setField(name, value) {
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setAuthGate(data.user ? "signedIn" : "signedOut"))
      .catch(() => setAuthGate("signedOut"));
  }, []);

  function onPhotoChange(event) {
    const file = event.target.files && event.target.files[0];
    setError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");

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

    const { error: problem, cleaned } = validateEntry(fields, photo);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setBusy(true);
    const supabase = createClient();
    let uploadedPath = "";

    try {
      // Owner comes from the authenticated session only — never the form.
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        setError(t("submit.signInFirst"));
        return;
      }

      // Never allow a second copy of the same game in the archive.
      const duplicate = await findDuplicateEntry(supabase, {
        title: cleaned.nameEnglish,
        nameKhmer: cleaned.nameKhmer,
      });
      if (duplicate) {
        setError(t("submit.duplicate"));
        return;
      }

      // One photo: unique name so existing files can never be overwritten.
      const ext = (photo.name.split(".").pop() || "jpg").toLowerCase();
      uploadedPath = `entries/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("entry-images")
        .upload(uploadedPath, photo, { contentType: photo.type });

      if (uploadError) {
        uploadedPath = "";
        setError(t("submit.photoFail"));
        return;
      }

      const { data: urlData } = supabase.storage
        .from("entry-images")
        .getPublicUrl(uploadedPath);

      const slug = await pickUniqueSlug(supabase, cleaned.nameEnglish);

      const { error: insertError } = await supabase.from("entries").insert(
        toEntryRow({
          ...cleaned,
          photoUrl: urlData.publicUrl,
          slug,
          owner: authData.user.id,
        })
      );

      if (insertError) {
        // The upload succeeded but the entry didn't — remove the orphan so
        // storage stays tidy and no incomplete row exists.
        await supabase.storage.from("entry-images").remove([uploadedPath]);
        setError(t("submit.insertFail"));
        return;
      }

      // Success: the entry is now pending review — tell the user instead of
      // sending them to a detail page that isn't published yet.
      setSubmitted(true);
    } catch {
      if (uploadedPath) {
        await supabase.storage.from("entry-images").remove([uploadedPath]);
      }
      setError(t("submit.unknown"));
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <p className={styles.notice} role="status">
        {t("submit.success")}{" "}
        <Link href="/my-entries" className={styles.switchLink}>
          {t("nav.myEntries")}
        </Link>
      </p>
    );
  }

  if (authGate === "loading") {
    return <p className={styles.notice}>{t("submit.checking")}</p>;
  }

  if (authGate === "signedOut") {
    return (
      <p className={styles.notice}>
        <Link href="/login" className={styles.switchLink}>
          {t("nav.logIn")}
        </Link>{" "}
        {t("submit.signInRest")}
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
          {busy ? t("submit.submitting") : t("submit.btn")}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          disabled={busy}
          onClick={() => router.push("/")}
        >
          {t("submit.cancel")}
        </button>
      </div>

      <p className={styles.hint}>
        {t("submit.hint")}
      </p>
    </form>
  );
}