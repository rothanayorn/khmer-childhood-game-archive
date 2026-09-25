import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { ENTRY_COLUMNS, toGame } from "@/lib/entries";
import styles from "./page.module.css";

// Dynamic route — the archive lives in Supabase, so every request reads the
// entry straight from the `entries` table (public read via RLS) instead of a
// list baked in at build time. Missing entries or an unreachable database 404
// cleanly rather than crashing.
export default async function GamePage({ params }) {
  let row = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("entries")
      .select(ENTRY_COLUMNS)
      .eq("slug", params.slug)
      .limit(1);
    if (!error && data && data[0]) row = data[0];
  } catch {
    row = null;
  }

  const game = row ? toGame(row) : null;
  if (!game) notFound();

  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Link href="/" className={styles.back}>
            ← All games
          </Link>

          <div className={styles.heroGrid}>
            <img src={game.image} alt="" aria-hidden="true" className={styles.heroImage} />

            <div>
              <h1 className={styles.nameKhmer} lang="km">
                {game.nameKhmer}
              </h1>
              <p className={styles.nameEnglish}>{game.nameEnglish}</p>
              <p className={styles.tagline}>{game.tagline}</p>

              <dl className={styles.meta}>
                <div>
                  <dt>Players</dt>
                  <dd>{game.players}</dd>
                </div>
                <div>
                  <dt>You&rsquo;ll need</dt>
                  <dd>{game.materials}</dd>
                </div>
                <div>
                  <dt>Contributed by</dt>
                  <dd>
                    {game.contributor} · {game.place}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <h2 className={styles.stepsHeading}>How to play</h2>
        <ol className={styles.steps}>
          {game.steps.map((step, i) => (
            <li key={i} className={styles.step}>
              <span className={styles.stepNumber}>{String(i + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>

        <Link href="/" className={styles.cta}>
          ← Back to all games
        </Link>
      </main>
    </>
  );
}
