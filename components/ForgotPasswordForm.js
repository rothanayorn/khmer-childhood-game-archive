"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "./EntryForm.module.css";

// Asks Supabase to email a reset link that lands on /auth/update-password.
// Those redirect paths must be allowed in Supabase Auth → URL Configuration.
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter the email address for your account.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/update-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      trimmed,
      { redirectTo }
    );
    setBusy(false);

    // Plain by design: never confirm whether an account exists.
    if (resetError) {
      setError("We could not send a reset email. Please try again.");
      return;
    }
    setMessage("Check your email for a password reset link.");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label className={styles.label}>
        Email
        <input
          className={styles.input}
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
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
        {busy ? "Sending…" : "Send reset link"}
      </button>

      <p className={styles.switch}>
        Remembered it?{" "}
        <Link href="/login" className={styles.switchLink}>
          Sign in
        </Link>
      </p>
    </form>
  );
}