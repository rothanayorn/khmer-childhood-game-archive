import SiteHeader from "@/components/SiteHeader";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Update your password — Khmer Childhood Games",
  description: "Choose a new password for your archive account.",
};

export default function UpdatePasswordPage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Password reset</p>
          <h1 className={styles.heroTitle}>Choose a new password</h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <UpdatePasswordForm />
      </main>
    </>
  );
}