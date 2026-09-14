import SiteHeader from "@/components/SiteHeader";
import GameSearch from "@/components/GameSearch";
import games from "@/data/games";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>An archive, kept by the people who played</p>
          <h1 className={styles.heroTitle}>
            Khmer childhood games that children played before smartphones
          </h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <GameSearch games={games} />
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>
            Collected from grandparents, cousins, and neighbours across Cambodia.
            Know a game that belongs here? Send it in.
          </p>
           <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLScsvx-OcnOtDEA5Z6V9H1yVg1l3-YV5P5Vgh5CWiaP35Y6K8w/viewform?usp=publish-editor"
            className={styles.submitBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            Send
            <span aria-hidden="true">→</span>
          </a>
              </div>
      </footer>
    </>
  );
}
