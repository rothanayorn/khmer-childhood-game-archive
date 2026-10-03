import SiteHeader from "@/components/SiteHeader";
import EditEntryForm from "@/components/EditEntryForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Edit entry — Khmer Childhood Games",
  description: "Make changes to an entry you created in the archive.",
};

export default function EditEntryPage({ params }) {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Your contribution</p>
          <h1 className={styles.heroTitle}>Edit entry</h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <EditEntryForm slug={params.slug} />
      </main>
    </>
  );
}