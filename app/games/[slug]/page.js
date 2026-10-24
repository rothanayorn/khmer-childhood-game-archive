import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import T from "@/components/T";
import GameDetailHero from "@/components/GameDetailHero";
import GameDetailBody from "@/components/GameDetailBody";
import { createClient } from "@/lib/supabase/server";
import { ENTRY_COLUMNS, ENTRY_COLUMNS_KM, toGame } from "@/lib/entries";
import styles from "./page.module.css";

// Dynamic route — the archive lives in Supabase, so every request reads the
// entry straight from the `entries` table (public read via RLS) instead of a
// list baked in at build time. Missing entries or an unreachable database 404
// cleanly rather than crashing.
export default async function GamePage({ params }) {
  let row = null;
  try {
    const supabase = await createClient();
    const { data: rows, error: loadError } = await supabase
      .from("entries")
      .select(`${ENTRY_COLUMNS_KM}, owner`)
      .eq("slug", params.slug)
      .limit(1);
    if (loadError || !rows || rows.length === 0) {
      // Migration 006 may not be applied yet — retry without the Khmer columns.
      const retry = await supabase
        .from("entries")
        .select(`id, ${ENTRY_COLUMNS}, owner`)
        .eq("slug", params.slug)
        .limit(1);
      if (!retry.error && retry.data && retry.data[0]) {
        row = retry.data[0];
      }
      return;
    }
    row = rows[0];
  } catch {
    row = null;
  }

  const game = row ? toGame(row) : null;
  if (!game) notFound();

  return (
    <>
      <SiteHeader />

      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <Link href="/" className={styles.back}>
            ← <T k="detail.allGames" />
          </Link>

          <div className={styles.heroGrid}>
            <img src={game.image} alt="" aria-hidden="true" className={styles.heroImage} />

            <GameDetailHero game={game} />
          </div>
        </div>
      </section>

      <div className="kramaStripe" />

      <main className={`container ${styles.main}`}>
        <GameDetailBody game={game} />
      </main>
    </>
  );
}
