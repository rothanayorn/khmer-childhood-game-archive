import SiteHeader from "@/components/SiteHeader";
import ConfirmEmail from "@/components/ConfirmEmail";
import T from "@/components/T";
import styles from "./page.module.css";

export const metadata = {
  title: "Confirm your email — Khmer Childhood Games",
  description: "Finishing your Khmer Childhood Games account confirmation.",
};

export default function ConfirmEmailPage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <T k="confirm.eyebrow" as="p" className={styles.eyebrow} />
          <T k="confirm.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <ConfirmEmail />
      </main>
    </>
  );
}