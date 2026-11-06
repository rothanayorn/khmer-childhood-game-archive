"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "./I18nProvider";
import styles from "./SubmitEntryButton.module.css";

// The "Submit entry" button lives on the home page and is always visible,
// signed in or not — it's the call to action for the whole archive. Signed-in
// visitors go straight to the submit form; signed-out visitors go to /login
// first (the /submit page also defends itself, so this is a convenience
// redirect, not the only guard).
export default function SubmitEntryButton() {
  const { t } = useI18n();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setSignedIn(Boolean(data.user)))
      .catch(() => setSignedIn(false));
  }, []);

  return (
    <Link href={signedIn ? "/submit" : "/login"} className={styles.submit}>
      {t("nav.submit")} <span aria-hidden="true">→</span>
    </Link>
  );
}