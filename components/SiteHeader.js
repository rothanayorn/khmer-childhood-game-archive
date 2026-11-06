"use client";

import { useState } from "react";
import Link from "next/link";
import AuthArea from "./AuthArea";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "./I18nProvider";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const { t } = useI18n();
  // Mobile-only nav drawer. Desktop ignores this (CSS keeps the nav visible
  // and hides the button), so there's nothing to reset on resize.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandEnglish}>{t("site.name")}</span>
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>

        <nav
          id="site-nav"
          className={menuOpen ? `${styles.nav} ${styles.navOpen}` : styles.nav}
          onClick={() => setMenuOpen(false)}
        >
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
