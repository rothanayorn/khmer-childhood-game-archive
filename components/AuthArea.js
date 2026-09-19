"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "./AuthArea.module.css";

// Renders inside the site header. Visitors see Log in / Sign up; signed-in
// users see their email and a Log out button. The session lives in cookies,
// so pages stay statically pre-rendered while this component confirms the
// cookie in the browser and keeps the header in sync after sign in/out.
export default function AuthArea() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    // Confirm whatever the session cookie claims.
    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null));

    // Stay in sync after sign in / sign out / token refresh, mid-page too.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // The SIGNED_OUT event also fires and clears the header; set it here too
    // so the UI never waits on the event bus.
    setUser(null);
  }

  if (user) {
    return (
      <>
        <span className={styles.email} title={user.email}>
          {user.email}
        </span>
        <button type="button" className={styles.logout} onClick={handleLogout}>
          Log out
        </button>
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={styles.navLink}>
        Log in
      </Link>
      <Link href="/signup" className={styles.navLink}>
        Sign up
      </Link>
    </>
  );
}