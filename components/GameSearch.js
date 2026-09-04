"use client";

import { useId, useState } from "react";
import GameCard from "./GameCard";
import { filterGames, pickRecommendations } from "@/lib/search";
import styles from "./GameSearch.module.css";

export default function GameSearch({ games }) {
  const inputId = useId();
  const [query, setQuery] = useState("");

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
          <span className={styles.labelKhmer}>ស្វែងរកល្បែង</span>
          <span className={styles.labelEnglish}>Search the archive</span>
        </label>

        <div className={styles.inputWrap}>
          <input
            id={inputId}
            type="search"
            className={styles.input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ស្វែងរក… ឧ. ចោលឈូង, tug, Sophea / Search…"
            autoComplete="off"
          />
          {hasQuery && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>

        <p className={styles.count} aria-live="polite">
          ល្បែង {results.length} · {results.length === 1 ? "game" : "games"}{" "}
          found
        </p>
      </form>

      {results.length > 0 ? (
        <div className={styles.grid}>
          {results.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyKhmer}>
            រកមិនឃើញ «{query}» ទេ។ សាកឈ្មោះជាភាសាខ្មែរ ឬអង់គ្លេស, អ្នកចូលរួម​ ឬ​ ទីកន្លែង​ ។
          </p>
          <p className={styles.emptyEnglish}>
            No games match &ldquo;{query}&rdquo;. Try a Khmer or English name, a
            contributor, or a place.
          </p>

          <div className={styles.recommend}>
            <p className={styles.recommendLabel}>
              <span className={styles.recommendKhmer}>សាកល្បែងទាំងនេះជំនួស</span>
              <span className={styles.recommendEnglish}>
                Try one of these instead:
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
                  <span className={styles.chipKhmer}>{game.nameKhmer}</span>
                  <span className={styles.chipEnglish}>{game.nameEnglish}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
