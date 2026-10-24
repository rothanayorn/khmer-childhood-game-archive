"use client";

import { useEffect, useId, useState } from "react";
import GameCard from "./GameCard";
import { filterGames, pickRecommendations } from "@/lib/search";
import { useI18n } from "./I18nProvider";
import styles from "./GameSearch.module.css";

export default function GameSearch() {
  const { t, lang } = useI18n();
  const inputId = useId();
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [query, setQuery] = useState("");

  // The archive lives in Supabase now — load it once from the API, then filter
  // locally on every keystroke exactly as before.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/entries")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        setGames(Array.isArray(data.games) ? data.games : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Dataset is tiny, so filtering live on every keystroke is cheap.
  const results = filterGames(games, query);
  const hasQuery = query.trim().length > 0;
  // Suggestions to offer when a search comes back empty.
  const recommendations =
    hasQuery && results.length === 0 ? pickRecommendations(games, query) : [];

  return (
    <>
      <form
        role="search"
        className={styles.searchBar}
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor={inputId} className={styles.label}>
          <span className={styles.labelKhmer} lang="km">
            ស្វែងរកល្បែង
          </span>
          {lang === "en" && (
            <span className={styles.labelEnglish}>{t("search.label")}</span>
          )}
        </label>

        <div className={styles.inputWrap}>
          <input
            id={inputId}
            type="search"
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder")}
            autoComplete="off"
          />
          {hasQuery && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => setQuery("")}
              aria-label={t("search.clear")}
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        <p className={styles.count} aria-live="polite">
          <span lang="km">ល្បែង</span> {results.length} ·{" "}
          {lang === "en" &&
            (results.length === 1 ? t("search.count") : t("search.countPlural"))}{" "}
          {t("search.countFound")}
        </p>
      </form>

      {status === "loading" ? (
        <p className={styles.loading}>{t("search.loading")}</p>
      ) : status === "error" ? (
        <p className={styles.error}>{t("search.error")}</p>
      ) : status === "ready" && games.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyEnglish}>{t("search.emptyTitle")}</p>
        </div>
      ) : results.length > 0 ? (
        <div className={styles.grid}>
          {results.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyKhmer} lang="km">
            រកមិនឃើញ «{query}» ទេ។ សាកឈ្មោះជាភាសាខ្មែរ ឬអង់គ្លេស, អ្នកចូលរួម​ ឬ​ ទីកន្លែង​ ។
          </p>
          {lang === "en" && (
            <p className={styles.emptyEnglish}>
              {t("search.noMatch", { query })}
            </p>
          )}

          <div className={styles.recommend}>
            <p className={styles.recommendLabel}>
              <span className={styles.recommendKhmer} lang="km">
                សាកល្បែងទាំងនេះជំនួស
              </span>
              <span className={styles.recommendEnglish}>
                {t("search.tryInstead")}
              </span>
            </p>
            <div className={styles.chips}>
              {recommendations.map((game) => (
                <button
                  key={game.slug}
                  type="button"
                  className={styles.chip}
                  onClick={() => setQuery(game.nameEnglish)}
                >
                  <span className={styles.chipKhmer} lang="km">
                    {game.nameKhmer}
                  </span>
                  {lang === "en" && (
                    <span className={styles.chipEnglish}>{game.nameEnglish}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
