import SiteHeader from "@/components/SiteHeader";
import GameSearch from "@/components/GameSearch";
import T from "@/components/T";
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
          <T k="browse.eyebrow" as="p" className={styles.eyebrow} />
          <T k="browse.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <GameSearch />
      </main>

    </>
  );
}
