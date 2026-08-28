import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import games, { getGameBySlug } from "@/data/games";
import styles from "./page.module.css";

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export function generateMetadata({ params }) {
  const game = getGameBySlug(params.slug);
  if (!game) return {};
  return {
    title: `How to play ${game.nameEnglish} — Khmer Childhood Games`,
    description: game.tagline,
  };
}

export default function GamePage({ params }) {
  const game = getGameBySlug(params.slug);
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
              <h1 className={styles.nameKhmer}>{game.nameKhmer}</h1>
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
