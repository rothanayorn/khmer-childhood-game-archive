import Link from "next/link";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandEnglish}>Khmer Childhood Games</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/browse" className={styles.navLink}>
            Browse
          </Link>
        </nav>
      </div>
      <div className="kramaStripe" />
    </header>
  );
}
