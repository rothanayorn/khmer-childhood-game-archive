"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "./I18nProvider";
import styles from "./AuthArea.module.css";

// Renders inside the site header. Visitors see Log in / Sign up; signed-in
// users see their email and a Log out button. The session lives in cookies,
// so pages stay statically pre-rendered while this component confirms the
// cookie in the browser and keeps the header in sync after sign in/out.
export default function AuthArea() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState(null);
  // Whether the signed-in user is a reviewer — controls the header Review link.
  const [reviewer, setReviewer] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Confirm whatever the session cookie claims.
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data.user);
        if (data.user) {
          supabase
            .rpc("is_reviewer")
            .then(({ data: reviewerData }) =>
              setReviewer(reviewerData === true)
            )
            .catch(() => setReviewer(false));
        } else {
          setReviewer(false);
        }
      })
      .catch(() => setUser(null));

    // Stay in sync after sign in / sign out / token refresh, mid-page too.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) setReviewer(false);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Clear the header immediately, then leave any private page (My Entries,
    // Review) so its rows cannot stay on screen after the session is gone.
    setUser(null);
    setReviewer(false);
    router.push("/login");
  }

  if (user) {
    return (
      <>
        <span className={styles.email} title={user.email}>
          {user.user_metadata?.username || user.email}
        </span>
        {reviewer && (
          <Link href="/review" className={styles.navLink}>
            {t("nav.review")}
          </Link>
        )}
        <Link href="/my-entries" className={styles.navLink}>
          {t("nav.myEntries")}
        </Link>
        <button type="button" className={styles.logout} onClick={handleLogout}>
          {t("nav.logOut")}
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={styles.navLink}>
        {t("nav.logIn")}
      </Link>
      <Link href="/signup" className={styles.navLink}>
        {t("nav.signUp")}
      </Link>
    </>
  );
}