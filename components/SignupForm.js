"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./SignupForm.module.css";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
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
      },
    });

    setBusy(false);
    if (authError) {
      // The one detail worth sharing is a duplicate account — withholding it
      // makes users repeat registration, which is what we want to prevent.
      // Everything else stays intentionally vague.
      const detail = String(authError.message ?? "").toLowerCase();
      if (detail.includes("already registered")) {
        setError(
          "An account with this email already exists. Check your inbox for the confirmation link, or sign in."
        );
      } else {
        setError("We could not create your account. Please try again.");
      }
      return;
    }

    // With email confirmation enabled there is no session yet — the user
    // still has to click the link Supabase just emailed them.
    if (!data.session) {
      setMessage(
        "Registration successful! Please check your email to confirm your account."
      );
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
      setError("Could not resend the email. Please try again.");
      return;
    }
    setMessage(
      "Confirmation email sent again — check your inbox, including spam."
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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

      <label className={styles.label}>
        Password
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
          Resend confirmation email
        </button>
      )}

      <button type="submit" className={styles.submitBtn} disabled={busy}>
        {busy ? "Creating account…" : "Create account"}
      </button>

      <p className={styles.switch}>
        Already have an account?{" "}
        <Link href="/login" className={styles.switchLink}>
          Sign in
        </Link>
      </p>
    </form>
  );
}