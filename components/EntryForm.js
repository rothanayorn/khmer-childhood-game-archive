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
  // Only authenticated users may submit; the form is a no-op otherwise.
  const [authGate, setAuthGate] = useState("loading"); // loading | signedIn | signedOut

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
        setError("Please sign in first to submit an entry.");
        return;
      }

      // Never allow a second copy of the same game in the archive.
      const duplicate = await findDuplicateEntry(supabase, {
        title: cleaned.nameEnglish,
        nameKhmer: cleaned.nameKhmer,
      });
      if (duplicate) {
        setError("An entry with this name already exists in the archive.");
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
        setError("The photo could not be uploaded. Please try again.");
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
        setError("We could not save your entry. Please try again.");
        return;
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

  if (authGate === "loading") {
    return <p className={styles.notice}>Checking your session…</p>;
  }

  if (authGate === "signedOut") {
    return (
      <p className={styles.notice}>
        Please{" "}
        <Link href="/login" className={styles.switchLink}>
          sign in
        </Link>{" "}
        to submit an entry.
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
          {busy ? "Submitting…" : "Submit entry"}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          disabled={busy}
          onClick={() => router.push("/")}
        >
          Cancel
        </button>
      </div>

      <p className={styles.hint}>
        Entries should be Khmer childhood or traditional children&rsquo;s games,
        with accurate information. Share only photos you are allowed to use.
        The archive owner may review, edit, or remove submissions.
      </p>
    </form>
  );
}