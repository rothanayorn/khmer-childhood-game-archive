-- 007 · Khmer contributor names + places
--
-- Adds optional Khmer columns for the contributor name and place, and fills
-- the seed entries with Khmer transliterations of the names. The spelling of
-- a person's name should match what their family prefers — adjust the values
-- below if a transliteration differs from the standard one.
--
-- Run in the Supabase SQL editor (same as 001–006). Safe to re-run.

alter table entries add column if not exists contributor_name_km text;
alter table entries add column if not exists place_km text;

-- 1. Chol Chhoung — Sophea Ly, Prey Veng
update entries set
  contributor_name_km = 'សុភា លី',
  place_km = 'ព្រៃវែង'
where slug = 'chol-chhoung';

-- 2. Leak Kanseng — Vantha Chan, Prey Veng
update entries set
  contributor_name_km = 'វណ្ណា ចាន់',
  place_km = 'ព្រៃវែង'
where slug = 'leak-kanseng';

-- 3. Bos Angkunh — Bunthoeun Prak, Prey Veng
update entries set
  contributor_name_km = 'ប៊ុនធឿន ប្រាក់',
  place_km = 'ព្រៃវែង'
where slug = 'bos-angkunh';

-- 4. Teanh Prot — Chenda Meas, Prey Veng
update entries set
  contributor_name_km = 'ចិន្តា មាស',
  place_km = 'ព្រៃវែង'
where slug = 'teanh-prot';

-- 5. Chab Kon Kaeb — Rithy Sok, Prey Veng
update entries set
  contributor_name_km = 'រិទ្ធី សុខ',
  place_km = 'ព្រៃវែង'
where slug = 'chab-kon-kaeb';

-- 6. Muek Jumping Game — Nita, Prey Veng
update entries set
  contributor_name_km = 'នីតា',
  place_km = 'ព្រៃវែង'
where slug = 'muek-jumping-game';

-- 7. Rubber Band Jumping Game — Chea Visal, Prey Veng
update entries set
  contributor_name_km = 'ជា វិសាល',
  place_km = 'ព្រៃវែង'
where slug = 'rubber-band-jumping-game';

-- 8. Stech Chong — Sok Karuna, Prey Veng
update entries set
  contributor_name_km = 'សុខ ករុណា',
  place_km = 'ព្រៃវែង'
where slug = 'stech-chong';