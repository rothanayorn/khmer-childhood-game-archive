import SiteHeader from "@/components/SiteHeader";
import EntryForm from "@/components/EntryForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Submit an entry — Khmer Childhood Games",
  description:
    "Share a Khmer childhood game or traditional children's game with the archive.",
};

export default function SubmitPage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Contribute to the archive</p>
          <h1 className={styles.heroTitle}>Submit an entry</h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <EntryForm />
      </main>
    </>
  );
}