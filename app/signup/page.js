import SiteHeader from "@/components/SiteHeader";
import SignupForm from "@/components/SignupForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Create an account — Khmer Childhood Games",
  description:
    "Create an account to contribute to the Khmer Childhood Games living archive.",
};

export default function SignupPage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Join the archive</p>
          <h1 className={styles.heroTitle}>Create your account</h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <SignupForm />
      </main>
    </>
  );
}