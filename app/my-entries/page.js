import SiteHeader from "@/components/SiteHeader";
import MyEntries from "@/components/MyEntries";
import styles from "./page.module.css";

export const metadata = {
  title: "My entries — Khmer Childhood Games",
  description: "The archive entries you created, with a button to edit them.",
};

export default function MyEntriesPage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Your contributions</p>
          <h1 className={styles.heroTitle}>My entries</h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <MyEntries />
      </main>
    </>
  );
}