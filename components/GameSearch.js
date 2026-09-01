"use client";

import { useId, useState } from "react";
import GameCard from "./GameCard";
import { filterGames } from "@/lib/search";
import styles from "./GameSearch.module.css";

export default function GameSearch({ games }) {
  const inputId = useId();
  const [query, setQuery] = useState("");

  // Dataset is tiny, so filtering live on every keystroke is cheap.
  const results = filterGames(games, query);
  const hasQuery = query.trim().length > 0;

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
        </div>
      )}
    </>
  );
}
