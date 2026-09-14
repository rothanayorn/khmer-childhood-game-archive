import SiteHeader from "@/components/SiteHeader";
import GameSearch from "@/components/GameSearch";
import games from "@/data/games";
import styles from "./page.module.css";

export const metadata = {
  title: "Khmer Childhood Games",
  description:
    "Search and browse every Khmer childhood game in the archive, in Khmer or English.",
};

export default function BrowsePage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>The whole collection</p>
          <h1 className={styles.heroTitle}>
            Browse &amp; search every game in the archive
          </h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <GameSearch games={games} />
      </main>

    </>
  );
}
