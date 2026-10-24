import SiteHeader from "@/components/SiteHeader";
import EditEntryForm from "@/components/EditEntryForm";
import T from "@/components/T";
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
          <T k="editPage.eyebrow" as="p" className={styles.eyebrow} />
          <T k="editPage.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <EditEntryForm slug={params.slug} />
      </main>
    </>
  );
}