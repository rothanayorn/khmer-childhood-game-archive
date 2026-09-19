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
    });

    setBusy(false);
    if (authError) {
      // Plain by design: never reveal why (e.g. "user already registered").
      setError("We could not create your account. Please try again.");
      return;
    }

    // With email confirmation enabled there is no session yet — the user
    // still has to click the link Supabase just emailed them.
    if (!data.session) {
      setMessage(
        "Check your email for a confirmation link to finish signing up."
      );
      return;
    }

    // Email confirmation is disabled for this project, so sign-up also
    // signed the user in — head home the way a successful login would.
    router.push("/");
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