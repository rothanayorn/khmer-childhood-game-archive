import SiteHeader from "@/components/SiteHeader";
import GameSearch from "@/components/GameSearch";
import SubmitEntryButton from "@/components/SubmitEntryButton";
import T from "@/components/T";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <T k="home.eyebrow" as="p" className={styles.eyebrow} />
          <T k="home.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <GameSearch />
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <T k="home.footer" as="p" />
          <div className={styles.footerActions}>
            <SubmitEntryButton />
          </div>
          </div>
      </footer>
    </>
  );
}
