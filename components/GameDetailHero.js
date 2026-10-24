"use client";

import { useI18n } from "./I18nProvider";
import { localizeEntry } from "@/lib/entryContent";
import styles from "@/app/games/[slug]/page.module.css";

// Language-aware hero info for the entry detail page. The server page passes
// the stored entry; this component applies Khmer content (database km columns
// → in-app overlay → stored text) according to the active language, exactly
// like the cards do — so in Khmer mode the tagline/players/materials switch.
export default function GameDetailHero({ game }) {
  const { t, lang } = useI18n();
  const g = localizeEntry(game, lang);

  return (
    <div>
      <h1 className={styles.nameKhmer} lang="km">
        {g.nameKhmer}
      </h1>
      {lang === "en" && (
        <p className={styles.nameEnglish}>{g.nameEnglish}</p>
      )}
      <p className={styles.tagline}>{g.tagline}</p>

      <dl className={styles.meta}>
        <div>
          <dt>{t("detail.players")}</dt>
          <dd>{g.players}</dd>
        </div>
        <div>
          <dt>{t("detail.need")}</dt>
          <dd>{g.materials}</dd>
        </div>
        <div>
          <dt>{t("detail.contributedBy")}</dt>
          <dd>
            {g.contributor} · {g.place}
          </dd>
        </div>
      </dl>
    </div>
  );
}