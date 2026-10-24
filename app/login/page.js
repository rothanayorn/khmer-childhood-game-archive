import SiteHeader from "@/components/SiteHeader";
import LoginForm from "@/components/LoginForm";
import T from "@/components/T";
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
          <T k="login.eyebrow" as="p" className={styles.eyebrow} />
          <T k="login.title" as="h1" className={styles.heroTitle} />
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <LoginForm />
      </main>
    </>
  );
}