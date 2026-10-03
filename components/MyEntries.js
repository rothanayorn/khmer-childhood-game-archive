"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { storagePathFromUrl } from "@/lib/entries";
import styles from "./MyEntries.module.css";

// Lists the entries the signed-in user created, each with an Edit link.
// The database enforces ownership (RLS); this only reads the user's own rows.
export default function MyEntries() {
  const [status, setStatus] = useState("loading"); // loading | signedOut | ready
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");

  async function handleDelete(entry) {
    const confirmed = window.confirm(
      `Delete "${entry.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleting(entry.id);
    const supabase = createClient();
    try {
      // RLS only allows deleting rows the signed-in user owns.
      const { error: deleteError } = await supabase
        .from("entries")
        .delete()
        .eq("id", entry.id);
      if (deleteError) {
        setError("Could not delete the entry. Please try again.");
        return;
      }
      // Remove the photo too, if it lives in the archive's storage bucket.
      const storagePath = storagePathFromUrl(entry.photo_url);
      if (storagePath) {
        await supabase.storage.from("entry-images").remove([storagePath]);
      }
      setEntries((prev) => prev.filter((row) => row.id !== entry.id));
      setError("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDeleting("");
    }
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
        const { data, error: listError } = await supabase
          .from("entries")
          .select("id, slug, title, name_khmer, photo_url, created_at")
          .eq("owner", authData.user.id)
          .order("created_at", { ascending: false });
        if (listError) {
          setError("Could not load your entries.");
          return;
        }
        setEntries(data ?? []);
        setStatus("ready");
      })
      .catch(() => setStatus("signedOut"));
  }, []);

  if (status === "loading") {
    return <p className={styles.notice}>Loading your entries…</p>;
  }

  if (status === "signedOut") {
    return (
      <p className={styles.notice}>
        Please{" "}
        <Link href="/login" className={styles.link}>
          sign in
        </Link>{" "}
        to see the entries you created.
      </p>
    );
  }

  if (error) {
    return <p className={styles.notice}>{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <p className={styles.notice}>
        You haven&rsquo;t created any entries yet.{" "}
        <Link href="/submit" className={styles.link}>
          Submit your first one
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.row}>
          <img
            src={entry.photo_url}
            alt=""
            aria-hidden="true"
            className={styles.thumb}
          />
          <div className={styles.info}>
            <p className={styles.khmer} lang="km">
              {entry.name_khmer}
            </p>
            <p className={styles.title}>{entry.title}</p>
          </div>
          <div className={styles.actions}>
            <Link href={`/edit/${entry.slug}`} className={styles.edit}>
              Edit →
            </Link>
            <button
              type="button"
              className={styles.delete}
              disabled={deleting === entry.id}
              onClick={() => handleDelete(entry)}
            >
              {deleting === entry.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}