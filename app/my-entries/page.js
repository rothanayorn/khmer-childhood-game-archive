import SiteHeader from "@/components/SiteHeader";
import MyEntries from "@/components/MyEntries";
import T from "@/components/T";
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
          <T k="myEntries.eyebrow" as="p" className={styles.eyebrow} />
          <T k="myEntries.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <MyEntries />
      </main>
    </>
  );
}