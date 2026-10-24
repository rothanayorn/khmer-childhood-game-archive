"use client";

import Link from "next/link";
import AuthArea from "./AuthArea";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "./I18nProvider";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const { t } = useI18n();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandEnglish}>{t("site.name")}</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            {t("nav.home")}
          </Link>
          <Link href="/browse" className={styles.navLink}>
            {t("nav.browse")}
          </Link>
          <AuthArea />
          <LanguageSwitcher />
        </nav>
      </div>
      <div className="kramaStripe" />
    </header>
  );
}
