"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ENTRY_COLUMNS_KM, toGame } from "@/lib/entries";
import { localizeEntry } from "@/lib/entryContent";
import { useI18n } from "./I18nProvider";
import styles from "./ReviewQueue.module.css";

// The sender's username lives in auth.users metadata, which the public API
// cannot read — show a short owner id until a read path is permitted.
function senderName(entry) {
  return "user-" + String(entry.owner || "").slice(0, 8);
}

// Named arguments are the only form this Supabase accepts (JSON-array payloads
// are rejected with PGRST102 "All object keys must match"), and every key must
// match the function's parameter names exactly. Set these to the real names of
// review_entry() — find them with:
//   select pg_get_function_identity_arguments('review_entry'::regproc);
const REVIEW_ID_ARG = "entry_id";
const REVIEW_DECISION_ARG = "decision";
// If review_entry() takes a third parameter (e.g. comment/reason), set the
// name here and REVIEW_SEND_COMMENT to true.
const REVIEW_COMMENT_ARG = "comment";
const REVIEW_SEND_COMMENT = false;

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReviewQueue() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [detail, setDetail] = useState("");
  const [comment, setComment] = useState({}); // entry.id -> text

  async function load() {
    setStatus("loading");
    const supabase = createClient();
    const { data, error: loadError } = await supabase
      .from("entries")
      .select(`id, ${ENTRY_COLUMNS_KM}, owner, created_at`)
      .eq("status", "pending")
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
  }, []);

  function commentFor(id) {
    return (comment[id] || "").trim();
  }

  async function decide(entry, decision) {
    setError("");
    setDetail("");

    // Returning requires a comment — the reviewer explains why before the
    // function will accept it. Publishing doesn't need one.
    if (decision === "returned" && !commentFor(entry.id)) {
      setError(t("review.commentRequired"));
      return;
    }

    setBusyId(entry.id);
    const supabase = createClient();
    // Call the function positionally with a raw JSON-array body. An array can
    // never be misread as named arguments, so parameter names (and any stale
    // bundle that would object-ify an object payload) can't cause the
    // "keys must match" mismatch.
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token || "";
    const args = { [REVIEW_ID_ARG]: entry.id, [REVIEW_DECISION_ARG]: decision };
    if (REVIEW_SEND_COMMENT) {
      args[REVIEW_COMMENT_ARG] = commentFor(entry.id);
    }
    let body = {};
    let ok = false;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/review_entry`,
        {
          method: "POST",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(args),
        }
      );
      body = await res.json().catch(() => ({}));
      ok = res.ok && body === true;
    } catch (err) {
      body = { message: err && err.message };
    }
    setBusyId("");
    if (!ok) {
      // Keep the friendly message, but also capture the technical reason so
      // database-side problems are discoverable in the console and on the page.
      const technical =
        body && typeof body === "object" && body.message
          ? body.message
          : JSON.stringify(body);
      console.error("review_entry failed:", [entry.id, decision], body);
      setError(t("review.fail"));
      setDetail(String(technical));
      return;
    }
    // The function only changes status; save the reviewer's comment so the
    // contributor can read the reason on /my-entries.
    if (decision === "returned") {
      const { error: commentError } = await supabase
        .from("review_comments")
        .insert({ entry_id: entry.id, comment: commentFor(entry.id) });
      if (commentError) {
        console.error("comment insert failed:", commentError);
      }
    }
    setItems((prev) => prev.filter((row) => row.id !== entry.id));
  }

  if (status === "loading") {
    return <p className={styles.notice}>{t("review.loading")}</p>;
  }

  if (status === "error") {
    return <p className={styles.notice}>{t("review.loadError")}</p>;
  }

  if (items.length === 0) {
    return <p className={styles.notice}>{t("review.empty")}</p>;
  }

  return (
    <div className={styles.list}>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {detail && (
        <p className={styles.errorDetail}>
          {detail}
        </p>
      )}
      {items.map((row) => {
        const entry = localizeEntry(toGame(row), lang);
        return (
          <article key={row.id} className={styles.card}>
            <div className={styles.head}>
              <img
                src={entry.image}
                alt=""
                aria-hidden="true"
                className={styles.thumb}
              />
              <div className={styles.headInfo}>
                <p className={styles.nameKhmer} lang="km">
                  {entry.nameKhmer}
                </p>
                {lang === "en" && (
                  <p className={styles.nameEnglish}>{entry.nameEnglish}</p>
                )}
              </div>
              <div className={styles.sender}>
                <p>
                  {t("review.sentBy")}: {senderName(row)}
                </p>
                <p>{t("review.sentAt")}: {formatTime(row.created_at)}</p>
              </div>
            </div>

            {entry.tagline && <p className={styles.tagline}>{entry.tagline}</p>}
            {entry.description && (
              <p className={styles.description}>{entry.description}</p>
            )}

            <dl className={styles.details}>
              <div>
                <dt>{t("detail.players")}</dt>
                <dd>{entry.players}</dd>
              </div>
              <div>
                <dt>{t("detail.need")}</dt>
                <dd>{entry.materials}</dd>
              </div>
              <div>
                <dt>{t("detail.contributedBy")}</dt>
                <dd>
                  {entry.contributor} · {entry.place}
                </dd>
              </div>
            </dl>

            {(entry.steps || []).length > 0 && (
              <ol className={styles.steps}>
                {entry.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            )}

            <label className={styles.commentLabel} htmlFor={`review-comment-${row.id}`}>
              {t("review.comment")}
            </label>
            <textarea
              id={`review-comment-${row.id}`}
              className={styles.comment}
              rows={2}
              maxLength={500}
              value={comment[row.id] || ""}
              onChange={(event) =>
                setComment((prev) => ({
                  ...prev,
                  [row.id]: event.target.value,
                }))
              }
              placeholder={t("review.commentPlaceholder")}
            />

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.publish}
                disabled={busyId === row.id}
                onClick={() => decide(row, "published")}
              >
                {t("review.publish")}
              </button>
              <button
                type="button"
                className={styles.return}
                disabled={busyId === row.id || !commentFor(row.id)}
                onClick={() => decide(row, "returned")}
              >
                {t("review.returnEntry")}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}