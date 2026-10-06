import SiteHeader from "@/components/SiteHeader";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Reset your password — Khmer Childhood Games",
  description: "Request an email link to reset your archive account password.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Account help</p>
          <h1 className={styles.heroTitle}>Reset your password</h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <ForgotPasswordForm />
      </main>
    </>
  );
}