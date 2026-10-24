"use client";

import { useI18n } from "./I18nProvider";
import styles from "./LanguageSwitcher.module.css";

// English / Khmer switcher shown in the header on every page.
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <div className={styles.switcher} role="group" aria-label={t("lang.switchTo")}>
      <button
        type="button"
        className={lang === "en" ? `${styles.btn} ${styles.active}` : styles.btn}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={lang === "km" ? `${styles.btn} ${styles.active}` : styles.btn}
        onClick={() => setLang("km")}
        aria-pressed={lang === "km"}
      >
        ខ្មែរ
      </button>
    </div>
  );
}