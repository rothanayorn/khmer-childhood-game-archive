import SiteHeader from "@/components/SiteHeader";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";
import T from "@/components/T";
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
          <T k="updatePassword.eyebrow" as="p" className={styles.eyebrow} />
          <T k="updatePassword.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <UpdatePasswordForm />
      </main>
    </>
  );
}