"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "./I18nProvider";
import styles from "./EntryForm.module.css";

// Destination of the email confirmation link. This project uses PKCE
// (the @supabase/ssr browser client hardcodes flowType "pkce" and
// detectSessionInUrl), so the `code` the link carries is exchanged for a
// session automatically the moment the client is created. We just wait for
// that exchange, then hand the user to /login with a clear status.
export default function ConfirmEmail() {
  const router = useRouter();
  const { t } = useI18n();
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
      setError(t("confirm.enterEmail"));
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
      setError(t("confirm.resendFail"));
      return;
    }
    setMessage(t("confirm.resent"));
  }

  if (state === "checking") {
    return <p className={styles.notice}>{t("confirm.checking")}</p>;
  }

  return (
    <>
      <p className={styles.notice}>
        {t("confirm.invalid")}{" "}
        <Link href="/login" className={styles.switchLink}>
          {t("confirm.signIn")}
        </Link>{" "}
        {t("confirm.resendIntro")}
      </p>

      {message && (
        <p className={styles.notice} role="status">
          {message}
        </p>
      )}

      <form className={styles.form} onSubmit={resendConfirmation} noValidate>
        <label className={styles.label}>
          {t("confirm.email")}
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
          {busy ? t("confirm.sending") : t("confirm.resend")}
        </button>
      </form>
    </>
  );
}