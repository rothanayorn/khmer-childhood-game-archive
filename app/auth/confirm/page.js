import SiteHeader from "@/components/SiteHeader";
import ConfirmEmail from "@/components/ConfirmEmail";
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
          <p className={styles.eyebrow}>Email confirmation</p>
          <h1 className={styles.heroTitle}>Confirm your email</h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <ConfirmEmail />
      </main>
    </>
  );
}