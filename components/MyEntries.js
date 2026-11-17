"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "./I18nProvider";
import styles from "./MyEntries.module.css";

const STATUS_KEYS = {
  pending: "statusPending",
  published: "statusPublished",
  returned: "statusReturned",
};

const STATUS_VARIANT = {
  pending: styles.pending,
  published: styles.published,
  returned: styles.returned,
};
// Lists the entries the signed-in user created, each with an Edit link.
// The database enforces ownership (RLS); this only reads the user's own rows.
export default function MyEntries() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState("loading"); // loading | signedOut | ready
  const [entries, setEntries] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");

  async function handleRequestDelete(entry) {
    const confirmed = window.confirm(
      t("myEntries.confirmRequestDelete", { title: entry.title })
    );
    if (!confirmed) return;

    setDeleting(entry.id);
    const supabase = createClient();
    try {
      // The row is not deleted here. The owner flags it; a reviewer approves
      // or rejects. RLS still limits this update to the owner's own rows.
      const { error: reqError } = await supabase
        .from("entries")
        .update({
          delete_requested: true,
          status_before_delete: entry.status || "pending",
        })
        .eq("id", entry.id);
      if (reqError) {
        setError(t("myEntries.requestFail"));
        return;
      }
      setEntries((prev) =>
        prev.map((row) =>
          row.id === entry.id ? { ...row, delete_requested: true } : row
        )
      );
      setError("");
    } catch {
      setError(t("myEntries.unknown"));
    } finally {
      setDeleting("");
    }
  }

  async function handleCancelDelete(entry) {
    setDeleting(entry.id);
    const supabase = createClient();
    try {
      const { error: cancelError } = await supabase
        .from("entries")
        .update({ delete_requested: false, status_before_delete: null })
        .eq("id", entry.id);
      if (cancelError) {
        setError(t("myEntries.cancelFail"));
        return;
      }
      setEntries((prev) =>
        prev.map((row) =>
          row.id === entry.id ? { ...row, delete_requested: false } : row
        )
      );
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
          .select(
            "id, slug, title, name_khmer, photo_url, created_at, status, delete_requested"
          )
          .eq("owner", authData.user.id)
          .order("created_at", { ascending: false });
        if (listError) {
          setError(t("myEntries.loadFail"));
          return;
        }
        setEntries(data ?? []);

        // For returned entries, load the reviewer's comment so the owner can
        // see why it was sent back.
        const returned = (data ?? []).filter(
          (entry) => entry.status === "returned"
        );
        if (returned.length > 0) {
          const { data: rows } = await supabase
            .from("review_comments")
            .select("entry_id, comment, created_at")
            .in(
              "entry_id",
              returned.map((entry) => entry.id)
            )
            .order("created_at", { ascending: false });
          setComments(rows ?? []);
        }

        setStatus("ready");
      })
      .catch(() => setStatus("signedOut"));

    // Logging out from the header must empty this list at once — never leave
    // someone else's (or even the previous user's) rows on screen.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          setEntries([]);
          setComments([]);
          setStatus("signedOut");
        }
      }
    );
    return () => subscription.subscription.unsubscribe();
  }, []);

  function reasonFor(id) {
    const found = comments.find((comment) => comment.entry_id === id);
    return found ? found.comment : "";
  }

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
            <p
              className={`${styles.status} ${
                entry.delete_requested
                  ? styles.requested
                  : STATUS_VARIANT[entry.status] || ""
              }`}
            >
              {entry.delete_requested
                ? t("myEntries.statusDeleteRequested")
                : STATUS_KEYS[entry.status]
                  ? t("myEntries." + STATUS_KEYS[entry.status])
                  : entry.status || ""}
            </p>
            {entry.status === "returned" && !entry.delete_requested && reasonFor(entry.id) && (
              <p className={styles.reason}>
                {t("myEntries.returnReason")}: {reasonFor(entry.id)}
              </p>
            )}
          </div>
          <div className={styles.actions}>
            <Link href={`/edit/${entry.slug}`} className={styles.edit}>
              {t("myEntries.edit")} →
            </Link>
            {entry.delete_requested ? (
              <button
                type="button"
                className={styles.delete}
                disabled={deleting === entry.id}
                onClick={() => handleCancelDelete(entry)}
              >
                {deleting === entry.id
                  ? t("myEntries.requesting")
                  : t("myEntries.cancelDelete")}
              </button>
            ) : (
              <button
                type="button"
                className={styles.delete}
                disabled={deleting === entry.id}
                onClick={() => handleRequestDelete(entry)}
              >
                {deleting === entry.id
                  ? t("myEntries.requesting")
                  : t("myEntries.requestDelete")}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}