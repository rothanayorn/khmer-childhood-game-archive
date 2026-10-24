"use client";

import Link from "next/link";
import { useI18n } from "./I18nProvider";
import { localizeEntry } from "@/lib/entryContent";
import styles from "@/app/games/[slug]/page.module.css";

// Language-aware "About the game", "How to play", and back link for the entry
// detail page — description and steps switch to Khmer in Khmer mode using the
// same localization layer as the cards.
export default function GameDetailBody({ game }) {
  const { t, lang } = useI18n();
  const g = localizeEntry(game, lang);

  return (
    <>
      <h2 className={styles.stepsHeading}>{t("detail.about")}</h2>
      <p className={styles.about}>{g.description}</p>

      <h2 className={styles.stepsHeading}>{t("detail.howToPlay")}</h2>
      <ol className={styles.steps}>
        {(g.steps ?? []).map((step, i) => (
          <li key={i} className={styles.step}>
            <span className={styles.stepNumber}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p>{step}</p>
          </li>
        ))}
      </ol>

      <Link href="/" className={styles.cta}>
        ← {t("detail.back")}
      </Link>
    </>
  );
}