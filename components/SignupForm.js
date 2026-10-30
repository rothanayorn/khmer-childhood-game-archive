"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "./I18nProvider";
import styles from "./SignupForm.module.css";

export default function SignupForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    // Username may be English or Khmer; it is stored in the user's Supabase
    // auth metadata (no schema change) and shown in the header instead of the
    // raw email address.
    const name = username.trim();
    if (!name) {
      setError(t("signup.usernameRequired"));
      return;
    }
    if (name.length > 30) {
      setError(t("signup.usernameTooLong"));
      return;
    }

    setBusy(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Confirmed users land on the confirmation callback page, which then
        // sends them to /login. Without this, Supabase points the email link
        // at the dashboard Site URL (the homepage), stranding users.
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: { username: name },
      },
    });

    setBusy(false);
    if (authError) {
      // The one detail worth sharing is a duplicate account — withholding it
      // makes users repeat registration, which is what we want to prevent.
      // Everything else stays intentionally vague.
      const detail = String(authError.message ?? "").toLowerCase();
      if (detail.includes("already registered")) {
        setError(t("signup.duplicate"));
      } else {
        setError(t("signup.fail"));
      }
      return;
    }

    // With email confirmation enabled there is no session yet — the user
    // still has to click the link Supabase just emailed them.
    if (!data.session) {
      setMessage(t("signup.success"));
      return;
    }

    // Email confirmation is disabled for this project, so sign-up also
    // signed the user in — head home the way a successful login would.
    router.push("/");
  }

  async function resendConfirmation() {
    setMessage("");
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    setBusy(false);
    if (resendError) {
      setError(t("signup.resendFail"));
      return;
    }
    setMessage(t("signup.resent"));
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
<span className={styles.labelText}>
          {t("signup.username")} <span className={styles.required}>*</span>
        </span>
        <span className={styles.optional}>{t("signup.usernameHint")}</span>
        <input
          className={styles.input}
          type="text"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          maxLength={30}
          required
        />
      </label>

      <label className={styles.label}>
<span className={styles.labelText}>
          {t("signup.email")} <span className={styles.required}>*</span>
        </span>
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

      <label className={styles.label}>
<span className={styles.labelText}>
          {t("signup.password")} <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className={styles.success} role="status">
          {message}
        </p>
      )}

      {message && (
        <button
          type="button"
          className={styles.resend}
          disabled={busy}
          onClick={resendConfirmation}
        >
          {t("signup.resend")}
        </button>
      )}

      <button type="submit" className={styles.submitBtn} disabled={busy}>
        {busy ? t("signup.creating") : t("signup.create")}
      </button>

      <p className={styles.switch}>
        {t("signup.already")}{" "}
        <Link href="/login" className={styles.switchLink}>
          {t("signup.signIn")}
        </Link>
      </p>
    </form>
  );
}