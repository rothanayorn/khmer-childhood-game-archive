import SiteHeader from "@/components/SiteHeader";
import T from "@/components/T";
import ReviewQueue from "@/components/ReviewQueue";
import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";

export const metadata = {
  title: "Review — Khmer Childhood Games",
  description: "Review pending archive entries.",
};

// Server gate: only reviewers may see anything here. Row-level security also
// limits the entries themselves, but this guard makes the empty page explicit.
export default async function ReviewPage() {
  let isReviewer = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("is_reviewer");
    isReviewer = data === true;
  } catch {
    isReviewer = false;
  }

  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <T k="review.eyebrow" as="p" className={styles.eyebrow} />
          <T k="review.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        {isReviewer ? (
          <ReviewQueue />
        ) : (
          <T k="review.permission" as="p" className={styles.notice} />
        )}
      </main>
    </>
  );
}