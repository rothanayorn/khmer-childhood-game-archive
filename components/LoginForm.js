"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  // The /auth/confirm callback redirects here with ?confirmed=1 after a
  // successful email confirmation, so the page can show the expected message.
  // Read on the client (after mount) so the page stays statically built.
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setConfirmed(
      new URLSearchParams(window.location.search).get("confirmed") === "1"
    );
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);

    // Plain by design: every failure — wrong password, unknown account,
    // unconfirmed email — surfaces as the same single message.
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setBusy(false);
    if (authError) {
      setError("Invalid email or password");
      return;
    }

    router.push("/");
  }

  return (
    <>
      {confirmed && (
        <p className={styles.notice} role="status">
          Your email has been confirmed. You can now sign in.
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
<span className={styles.labelText}>
          Email <span className={styles.required}>*</span>
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
          Password <span className={styles.required}>*</span>
        </span>
        <input
          className={styles.input}
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          minLength={6}
          required
        />
      </label>

      <p className={styles.forgot}>
        <Link href="/forgot-password" className={styles.switchLink}>
          Forgot password?
        </Link>
      </p>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <p className={styles.switch}>
        New to the archive?{" "}
        <Link href="/signup" className={styles.switchLink}>
          Create an account
        </Link>
      </p>
      </form>
    </>
  );
}