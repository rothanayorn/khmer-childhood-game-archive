"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { storagePathFromUrl } from "@/lib/entries";
import { useI18n } from "./I18nProvider";
import styles from "./ReviewQueue.module.css";

// Reviewer queue for owner delete requests. Approving really deletes the
// row (reviewer DELETE policy). Rejecting puts the entry back the way it
// was (delete_requested cleared, previous status restored).
export default function DeleteRequests() {
  const { t } = useI18n();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | signedOut | error
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setStatus("loading");
    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("entries")
      .select(
        "id, slug, title, name_khmer, photo_url, owner, created_at, status, delete_requested, status_before_delete"
      )
      .eq("delete_requested", true)
      .order("created_at", { ascending: true });
    if (loadError) {
      setStatus("error");
      return;
    }
    setItems(data ?? []);
    setStatus("ready");
  }

  useEffect(() => {
    load();
    const supabase = createClient();
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          setItems([]);
          setStatus("signedOut");
        }
      }
    );
    return () => subscription.subscription.unsubscribe();
  }, []);

  async function approve(entry) {
    const confirmed = window.confirm(
      t("review.confirmDeleteNow", { title: entry.title })
    );
    if (!confirmed) return;
    setBusyId(entry.id);
    setError("");
    const supabase = createClient();
    try {
      // Reviewer DELETE policy is what actually removes the row.
      const { error: deleteError } = await supabase
        .from("entries")
        .delete()
        .eq("id", entry.id);
      if (deleteError) {
        setError(t("review.approveFail"));
        return;
      }
      const path = storagePathFromUrl(entry.photo_url);
      if (path) {
        await supabase.storage.from("entry-images").remove([path]);
      }
      setItems((prev) => prev.filter((row) => row.id !== entry.id));
    } catch {
      setError(t("review.approveFail"));
    } finally {
      setBusyId("");
    }
  }

  async function reject(entry) {
    setBusyId(entry.id);
    setError("");
    const supabase = createClient();
    try {
      const { error: rejectError } = await supabase
        .from("entries")
        .update({ delete_requested: false, status_before_delete: null })
        .eq("id", entry.id);
      if (rejectError) {
        setError(t("review.rejectFail"));
        return;
      }
      setItems((prev) => prev.filter((row) => row.id !== entry.id));
    } catch {
      setError(t("review.rejectFail"));
    } finally {
      setBusyId("");
    }
  }

  if (status === "signedOut") {
    return (
      <p className={styles.notice}>
        <Link href="/login" className={styles.link}>
          {t("nav.logIn")}
        </Link>{" "}
        {t("review.permission")}
      </p>
    );
  }

  if (status === "loading") {
    return <p className={styles.notice}>{t("review.loadingDeletes")}</p>;
  }

  if (status === "error") {
    return <p className={styles.notice}>{t("review.loadDeletesFail")}</p>;
  }

  return (
    <section className={styles.deleteSection}>
      <h2 className={styles.sectionTitle}>{t("review.deletesHeading")}</h2>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {items.length === 0 ? (
        <p className={styles.notice}>{t("review.noDeletes")}</p>
      ) : (
        <ul className={styles.deleteList}>
          {items.map((entry) => (
            <li key={entry.id} className={styles.deleteRow}>
              <img
                src={entry.photo_url}
                alt=""
                aria-hidden="true"
                className={styles.thumb}
              />
              <div className={styles.deleteInfo}>
                <p className={styles.nameKhmer} lang="km">
                  {entry.name_khmer}
                </p>
                <p className={styles.nameEnglish}>{entry.title}</p>
                <p className={styles.sender}>
                  {t("review.sentBy")}: user-{String(entry.owner || "").slice(0, 8)}
                </p>
                <p className={styles.sender}>
                  {t("review.sentAt")}:{" "}
                  {new Date(entry.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.deleteNow}
                  disabled={busyId === entry.id}
                  onClick={() => approve(entry)}
                >
                  {busyId === entry.id
                    ? t("review.deleting")
                    : t("review.approveDelete")}
                </button>
                <button
                  type="button"
                  className={styles.return}
                  disabled={busyId === entry.id}
                  onClick={() => reject(entry)}
                >
                  {t("review.keepEntry")}
                </button>
                <Link href={`/edit/${entry.slug}`} className={styles.editLink}>
                  {t("review.edit")}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
