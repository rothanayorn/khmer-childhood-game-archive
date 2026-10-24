"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "./I18nProvider";
import styles from "./EntryForm.module.css";

// Where Supabase's reset email lands. The browser client picks the recovery
// token out of the URL automatically, so getUser() here confirms the session
// and updateUser() sets the new password within it.
export default function UpdatePasswordForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState("checking"); // checking | ready | invalid
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setStatus(data.user ? "ready" : "invalid"))
      .catch(() => setStatus("invalid"));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!password.trim() || password.trim().length < 6) {
      setError(t("updatePassword.short"));
      return;
    }
    if (password !== confirm) {
      setError(t("updatePassword.mismatch"));
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) {
      setError(t("updatePassword.fail"));
      return;
    }
    setMessage(t("updatePassword.updated"));
  }

  if (status === "checking") {
    return <p className={styles.notice}>{t("updatePassword.checking")}</p>;
  }

  if (status === "invalid") {
    return (
      <p className={styles.notice}>
        {t("updatePassword.invalid")}{" "}
        <Link href="/forgot-password" className={styles.switchLink}>
          {t("updatePassword.requestNew")}
        </Link>
        .
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.label}>
<span className={styles.labelText}>
          {t("updatePassword.password")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          maxLength={72}
          required
        />
      </label>

      <label className={styles.label}>
<span className={styles.labelText}>
          {t("updatePassword.confirm")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="password"
          name="confirm"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="new-password"
          maxLength={72}
          required
        />
      </label>

      {message && (
        <p className={styles.notice} role="status">
          {message}
        </p>
      )}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={busy}>
        {busy ? t("updatePassword.updating") : t("updatePassword.update")}
      </button>

      <p className={styles.switch}>
        {t("updatePassword.back")} <Link href="/login" className={styles.switchLink}>{t("updatePassword.signIn")}</Link>
      </p>
    </form>
  );
}