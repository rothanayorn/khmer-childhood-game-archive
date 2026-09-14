import Link from "next/link";
import styles from "./GameCard.module.css";

export default function GameCard({ game }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={game.image} alt="" aria-hidden="true" className={styles.image} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.nameKhmer} lang="km">
          {game.nameKhmer}
        </h3>
        <p className={styles.nameEnglish}>{game.nameEnglish}</p>

        <p className={styles.description}>{game.description}</p>

        <dl className={styles.meta}>
          <div className={styles.metaItem}>
            <dt>Contributed by</dt>
            <dd>{game.contributor}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt>Place</dt>
            <dd>{game.place}</dd>
          </div>
        </dl>

      </div>
    </article>
  );
}
