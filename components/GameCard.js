import Link from "next/link";
import { useI18n } from "./I18nProvider";
import { localizeEntry } from "@/lib/entryContent";
import styles from "./GameCard.module.css";

export default function GameCard({ game }) {
  const { t, lang } = useI18n();
  const g = localizeEntry(game, lang);
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={g.image} alt="" aria-hidden="true" className={styles.image} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.nameKhmer} lang="km">
          {g.nameKhmer}
        </h3>
        {lang === "en" && (
          <p className={styles.nameEnglish}>{g.nameEnglish}</p>
        )}

        <p className={styles.description}>{g.description}</p>

        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt>{t("card.contributedBy")}</dt>
            <dd>{g.contributor}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>{t("card.place")}</dt>
            <dd>{g.place}</dd>
          </div>
        </dl>

        <Link href={`/games/${g.slug}`} className={styles.cta}>
          {t("card.viewDetails")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
