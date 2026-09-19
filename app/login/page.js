import SiteHeader from "@/components/SiteHeader";
import LoginForm from "@/components/LoginForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Sign in — Khmer Childhood Games",
  description:
    "Sign in to your account for the Khmer Childhood Games living archive.",
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Welcome back</p>
          <h1 className={styles.heroTitle}>Sign in to the archive</h1>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <LoginForm />
      </main>
    </>
  );
}