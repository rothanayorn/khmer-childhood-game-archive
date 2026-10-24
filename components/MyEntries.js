"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { storagePathFromUrl } from "@/lib/entries";
import { useI18n } from "./I18nProvider";
import styles from "./MyEntries.module.css";

// Lists the entries the signed-in user created, each with an Edit link.
// The database enforces ownership (RLS); this only reads the user's own rows.
export default function MyEntries() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState("loading"); // loading | signedOut | ready
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");

  async function handleDelete(entry) {
    const confirmed = window.confirm(
      t("myEntries.confirmDelete", { title: entry.title })
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
        setError(t("myEntries.deleteFail"));
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
      setError(t("myEntries.unknown"));
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
          setError(t("myEntries.loadFail"));
          return;
        }
        setEntries(data ?? []);
        setStatus("ready");
      })
      .catch(() => setStatus("signedOut"));
  }, []);

  if (status === "loading") {
    return <p className={styles.notice}>{t("myEntries.loading")}</p>;
  }

  if (status === "signedOut") {
    return (
      <p className={styles.notice}>
        <Link href="/login" className={styles.link}>
          {t("nav.logIn")}
        </Link>{" "}
        {t("myEntries.signIn")}
      </p>
    );
  }

  if (error) {
    return <p className={styles.notice}>{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <p className={styles.notice}>
        {t("myEntries.empty")}{" "}
        <Link href="/submit" className={styles.link}>
          {t("myEntries.submitFirst")}
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
            {lang === "en" && (
              <p className={styles.title}>{entry.title}</p>
            )}
          </div>
          <div className={styles.actions}>
            <Link href={`/edit/${entry.slug}`} className={styles.edit}>
              {t("myEntries.edit")} →
            </Link>
            <button
              type="button"
              className={styles.delete}
              disabled={deleting === entry.id}
              onClick={() => handleDelete(entry)}
            >
              {deleting === entry.id ? t("myEntries.deleting") : t("myEntries.delete")}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}