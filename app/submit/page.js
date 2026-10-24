import SiteHeader from "@/components/SiteHeader";
import EntryForm from "@/components/EntryForm";
import T from "@/components/T";
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
          <T k="submit.eyebrow" as="p" className={styles.eyebrow} />
          <T k="submit.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <EntryForm />
      </main>
    </>
  );
}