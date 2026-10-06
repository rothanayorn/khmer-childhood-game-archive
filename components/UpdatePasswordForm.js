"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "./EntryForm.module.css";

// Where Supabase's reset email lands. The browser client picks the recovery
// token out of the URL automatically, so getUser() here confirms the session
// and updateUser() sets the new password within it.
export default function UpdatePasswordForm() {
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
      setError("Your password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) {
      setError("We could not update your password. Please try again.");
      return;
    }
    setMessage("Your password has been updated.");
  }

  if (status === "checking") {
    return <p className={styles.notice}>Checking your reset link…</p>;
  }

  if (status === "invalid") {
    return (
      <p className={styles.notice}>
        This reset link is invalid or has expired.{" "}
        <Link href="/forgot-password" className={styles.switchLink}>
          Request a new one
        </Link>
        .
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.label}>
        New password
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
        Confirm new password
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
        {busy ? "Updating…" : "Update password"}
      </button>

      <p className={styles.switch}>
        Back to{" "}
        <Link href="/login" className={styles.switchLink}>
          sign in
        </Link>
      </p>
    </form>
  );
}