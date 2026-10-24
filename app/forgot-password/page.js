import SiteHeader from "@/components/SiteHeader";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import T from "@/components/T";
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
          <T k="forgot.eyebrow" as="p" className={styles.eyebrow} />
          <T k="forgot.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <ForgotPasswordForm />
      </main>
    </>
  );
}