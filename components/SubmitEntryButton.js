"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import styles from "./SubmitEntryButton.module.css";

// The "Submit entry" button lives in the site footer and only makes sense for
// signed-in users (the /submit page defends itself too). It renders nothing
// for visitors until the session cookie has been confirmed, so the footer
// stays identical for logged-out visitors.
export default function SubmitEntryButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setShow(Boolean(data.user)))
      .catch(() => setShow(false));
  }, []);

  if (!show) return null;

  return (
    <Link href="/submit" className={styles.submit}>
      Submit entry <span aria-hidden="true">→</span>
    </Link>
  );
}