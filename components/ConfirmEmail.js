"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./EntryForm.module.css";

// Destination of the email confirmation link. This project uses PKCE
// (the @supabase/ssr browser client hardcodes flowType "pkce" and
// detectSessionInUrl), so the `code` the link carries is exchanged for a
// session automatically the moment the client is created. We just wait for
// that exchange, then hand the user to /login with a clear status.
export default function ConfirmEmail() {
  const router = useRouter();
  const [state, setState] = useState("checking"); // checking | invalid
  const [resendEmail, setResendEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (data.user) {
          router.push("/login?confirmed=1");
        } else {
          setState("invalid");
        }
      })
      .catch(() => setState("invalid"));
  }, []);

  async function resendConfirmation(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const email = resendEmail.trim();
    if (!email) {
      setError("Enter the email you registered with.");
      return;
    }

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

  if (state === "checking") {
    return <p className={styles.notice}>Confirming your email…</p>;
  }

  return (
    <>
      <p className={styles.notice}>
        This confirmation link is invalid or has expired.{" "}
        <Link href="/login" className={styles.switchLink}>
          Sign in
        </Link>{" "}
        or resend a new confirmation email below.
      </p>

      {message && (
        <p className={styles.notice} role="status">
          {message}
        </p>
      )}

      <form className={styles.form} onSubmit={resendConfirmation} noValidate>
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={resendEmail}
            onChange={(event) => setResendEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className={styles.submitBtn} disabled={busy}>
          {busy ? "Sending…" : "Resend confirmation email"}
        </button>
      </form>
    </>
  );
}