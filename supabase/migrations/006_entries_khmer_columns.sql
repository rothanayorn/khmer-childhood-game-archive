-- 006 · Khmer content columns for entries
--
-- Run this in the Supabase SQL editor (same as 001–005). It adds optional
-- Khmer fields so entries can be displayed fully in Khmer, then updates the
-- seed entries — paste the Khmer translation for each field inside the single
-- quotes below and press Run.
--
-- Rules when filling in:
--  * Text is Khmer script, as-is (no transliteration, no Latin).
--  * Apostrophes inside text must be doubled: it's  -> it''s
--  * steps_km is the Khmer how-to-play list, one string per step, in order.
--  * Leave a field as an empty string '' (or null) to keep the stored English
--    text for it — the app falls back automatically.
--  * A translation applies to ALL users, not just the Khmer-language UI.
--  * Re-running is safe.

alter table entries add column if not exists tagline_km text;
alter table entries add column if not exists description_km text;
alter table entries add column if not exists players_km text;
alter table entries add column if not exists materials_km text;
alter table entries add column if not exists steps_km text[];

-- ───────────────────────────────────────────────────────────────────────────
-- 1. Chol Chhoung  (ចោលឈូង)
--    tagline (EN): "A rolled-cloth throwing game played in a circle at Khmer New Year."
--    description (EN): "Players split into two lines facing each other and take
--      turns throwing a tightly rolled cloth ball, the chhoung, across the
--      circle while singing call-and-response verses. Whoever is tagged has to
--      dance for the group before the game continues."
--    players (EN): "8–20 players, in two teams"
--    materials (EN): "A krama (scarf) rolled and knotted into a ball"
--    steps (EN): 1. Split everyone into two even lines standing a few metres apart.
--                2. One team rolls the krama tightly and knots it into a ball.
--                3. A player sings a short verse and throws the chhoung.
--                4. Receivers catch or dodge; whoever is tagged must dance.
--                5. Play continues, alternating throws.
-- ---------------------------------------------------------------------------
update entries set
  tagline_km = 'ល្បែងប្រជាប្រិយខ្មែរដែលលេងដោយបោះឈូងធ្វើពីក្រម៉ាទៅវិញទៅមកជារង្វង់ ក្នុងឱកាសបុណ្យចូលឆ្នាំថ្មីប្រពៃណីខ្មែរ។',
  description_km = 'អ្នកលេងត្រូវបែងចែកជាពីរជួរ ដោយឈរប្រឈមមុខគ្នា។ ក្រុមទាំងពីរប្តូរវេនគ្នាបោះឈូងដែលធ្វើពីក្រម៉ារមូរយ៉ាងតឹងពីក្រុមមួយទៅក្រុមមួយទៀត ព្រមទាំងច្រៀងឆ្លើយឆ្លងគ្នាតាមចង្វាក់បទចម្រៀងប្រពៃណី។ អ្នកដែលត្រូវឈូងប៉ះ ឬចាប់ឈូងមិនបាន ត្រូវចេញមករាំនៅកណ្តាលរង្វង់ ខណៈដែលអ្នកដទៃច្រៀង និងទះដៃអបអរ។ បន្ទាប់មក ល្បែងនឹងបន្តលេងទៀត។',
  players_km = 'អ្នកលេងពី ៨ ទៅ ២០ នាក់ ចែកជា ២ ក្រុម។ ',
  materials_km = 'ក្រម៉ាមួយដែលរមូរឱ្យតឹង រួចចងជាដុំមូលសម្រាប់ប្រើជាឈូង។',
  steps_km = array[
  'បែងចែកអ្នកលេងជាពីរក្រុមដែលមានចំនួនស្មើគ្នា។ ក្រុមនីមួយៗឈរជាជួរប្រឈមមុខគ្នា ដោយមានចម្ងាយពីគ្នាប៉ុន្មានម៉ែត្រ។',
  'យកក្រម៉ាមករមូរឱ្យតឹង រួចចងវាឱ្យមានរាងមូល។ ដុំនេះហៅថា «ឈូង»។',
  'អ្នកលេងម្នាក់ក្នុងជួរទីមួយច្រៀងឃ្លាខ្លីមួយ រួចបោះឈូងទៅកាន់អ្នកលេងក្នុងជួរម្ខាងទៀត។',
  'អ្នកលេងក្នុងក្រុមម្ខាងទៀតព្យាយាមចាប់ឈូង ឬគេចពីឈូង។ អ្នកដែលត្រូវឈូងប៉ះ ឬចាប់ឈូងមិនបាន ត្រូវចាត់ទុកថាត្រូវឈូង។',
  'អ្នកដែលត្រូវឈូងត្រូវចេញមករាំនៅកណ្តាលរង្វង់ ខណៈដែលអ្នកលេងផ្សេងទៀតច្រៀង និងទះដៃតាមចង្វាក់។',
  'ក្រុមទាំងពីរបន្តប្តូរវេនគ្នាច្រៀង និងបោះឈូង រហូតដល់អ្នកលេងអស់កម្លាំង ឬដល់ពេលល្ងាច។'
]
where slug = 'chol-chhoung';

-- 2. Leak Kanseng  (លាក់កន្សែង)
--    tagline (EN): "A hide-the-scarf chasing game, close cousin of duck-duck-goose."
--    description (EN): "Children sit in a circle with their eyes closed and hands
--      open behind their backs while one player quietly circles the outside with
--      a rolled scarf, trying to drop it behind someone without being noticed."
--    players (EN): "6–15 players, one at a time is 'it'"
--    materials (EN): "A rolled krama or any small scarf"
update entries set
  tagline_km = 'ល្បែងប្រជាប្រិយខ្មែរដែលអ្នកលេងលាក់កន្សែងពីក្រោយអ្នកដទៃ ហើយរត់ដេញតាមគ្នាជុំវិញរង្វង់ ស្រដៀងនឹងល្បែង Duck-Duck-Goose។',
  description_km = 'អ្នកលេងទាំងអស់អង្គុយជារង្វង់ ដោយបិទភ្នែក និងដាក់ដៃបើកនៅខាងក្រោយខ្នង។ អ្នកលេងម្នាក់កាន់កន្សែងដើរជុំវិញខាងក្រៅរង្វង់យ៉ាងស្ងាត់ ដោយព្យាយាមដាក់កន្សែងនៅពីក្រោយអ្នកណាម្នាក់ដោយមិនឱ្យគេដឹងខ្លួន។ ប្រសិនបើអ្នកលេងណាម្នាក់រកឃើញកន្សែង គេត្រូវក្រោកឡើងរត់ដេញតាមអ្នកដែលបានលាក់កន្សែង។',
  players_km = 'អ្នកលេងពី ៦ ទៅ ១៥ នាក់ ដោយមានអ្នកលាក់កន្សែងម្នាក់ម្តងៗ។',
  materials_km = 'ក្រម៉ាដែលរមូរជាដុំ ឬកន្សែងតូចមួយ។',
  steps_km = array[
    'អ្នកលេងទាំងអស់អង្គុយបត់ជើងជារង្វង់ ដោយបែរមុខចូលកណ្តាល បិទភ្នែក និងដាក់ដៃបើកនៅខាងក្រោយខ្នង។',
    'អ្នកលេងម្នាក់កាន់កន្សែងដែលរមូរជាដុំ រួចដើរយ៉ាងស្ងាត់ជុំវិញខាងក្រៅរង្វង់។',
    'អ្នកលេងដែលកាន់កន្សែងត្រូវដាក់កន្សែងនៅពីក្រោយអ្នកលេងណាម្នាក់ ដោយមិនឱ្យអ្នកនោះដឹងខ្លួន រួចបន្តដើរដូចជាមិនមានកន្សែងនៅក្នុងដៃ។',
    'អ្នកលេងដែលកំពុងអង្គុយអាចស្ទាបមើលនៅខាងក្រោយខ្នងរបស់ខ្លួនម្តងម្កាល ដើម្បីពិនិត្យថាតើមានកន្សែងនៅពីក្រោយខ្លួនឬអត់។',
    'ប្រសិនបើអ្នកលេងណាម្នាក់រកឃើញកន្សែងនៅពីក្រោយខ្លួន គេត្រូវក្រោកឡើងភ្លាមៗ ហើយរត់ដេញតាមអ្នកដែលបានលាក់កន្សែងជុំវិញរង្វង់។',
    'ប្រសិនបើអ្នកលាក់កន្សែងត្រូវគេចាប់បានមុនពេលទៅដល់កន្លែងទំនេរ គេត្រូវបន្តលាក់កន្សែងម្តងទៀត។ ប៉ុន្តែប្រសិនបើគេរត់ដល់កន្លែងទំនេរមុនត្រូវចាប់បាន អ្នកដែលរត់ដេញតាមត្រូវក្លាយជាអ្នកលាក់កន្សែងថ្មី។'
  ]
where slug = 'leak-kanseng';

-- 3. Bos Angkunh  (បោះអង្គញ់)
--    tagline (EN): "A precision throwing game played with the hard seeds of the angkunh tree."
--    description (EN): "Two teams take turns setting up rows of angkunh seeds on
--      the ground and trying to knock them down using a single seed held between
--      the toes and flicked by hand — part marksmanship, part balance."
--    players (EN): "4–12 players, in two teams"
--    materials (EN): "A handful of dried angkunh seeds"
update entries set
  tagline_km = 'ល្បែងប្រជាប្រិយខ្មែរដែលប្រើគ្រាប់អង្គញ់រឹងៗដើម្បីបោះសំដៅផ្តួលគ្រាប់អង្គញ់របស់ក្រុមម្ខាងទៀត។',
  description_km = 'ក្រុមទាំងពីរប្តូរវេនគ្នារៀបចំគ្រាប់អង្គញ់ជាជួរនៅលើដី ហើយព្យាយាមបោះគ្រាប់អង្គញ់របស់ខ្លួនដើម្បីផ្តួលគ្រាប់អង្គញ់របស់ក្រុមម្ខាងទៀត។ អ្នកលេងដាក់គ្រាប់អង្គញ់មួយគ្រាប់នៅចន្លោះម្រាមជើងពីរ រួចប្រើដៃជួយផ្លាតបោះទៅមុខ។ ល្បែងនេះទាមទារភាពត្រឹមត្រូវក្នុងការបោះ និងការរក្សាលំនឹង។',
  players_km = 'អ្នកលេងពី ៤ ទៅ ១២ នាក់ ចែកជា ២ ក្រុម។',
  materials_km = 'គ្រាប់អង្គញ់ស្ងួតមួយចំនួន។',
  steps_km = array[
    'ក្រុមទីមួយរៀបចំគ្រាប់អង្គញ់ជាច្រើនគ្រាប់ឱ្យឈរត្រង់ជាជួរនៅលើដីរាបស្មើ។ ជួរគ្រាប់អង្គញ់នេះគឺជាគោលដៅសម្រាប់បោះ។',
    'ក្រុមម្ខាងទៀតឈរនៅចម្ងាយដែលបានព្រមព្រៀងគ្នា ដោយអ្នកលេងម្នាក់ៗមានគ្រាប់អង្គញ់មួយគ្រាប់សម្រាប់បោះ។',
    'អ្នកលេងដាក់គ្រាប់អង្គញ់របស់ខ្លួននៅចន្លោះម្រាមជើងពីរ រួចប្រើដៃជួយផ្លាតគ្រាប់អង្គញ់ទៅមុខ ដើម្បីផ្តួលគ្រាប់អង្គញ់ដែលតម្រៀបជាគោលដៅ។',
    'គ្រាប់អង្គញ់ដែលត្រូវបានបោះឱ្យដួល ត្រូវប្រមូលទុកជាពិន្ទុសម្រាប់ក្រុមដែលកំពុងបោះ។',
    'នៅពេលអ្នកលេងទាំងអស់ក្នុងក្រុមបានបោះគ្រប់គ្នាហើយ ក្រុមទាំងពីរប្តូរតួនាទីគ្នា។',
    'បន្តលេងតាមចំនួនជុំដែលបានព្រមព្រៀងគ្នា។ ក្រុមដែលប្រមូលបានគ្រាប់អង្គញ់ច្រើនជាងគេនៅពេលបញ្ចប់ការប្រកួត គឺជាក្រុមឈ្នះ។'
  ]
where slug = 'bos-angkunh';

-- 4. Teanh Prot  (ទាញព្រ័ត្រ)
--    tagline (EN): "Tug-of-war, played at festivals with rope, cloth, or bare hands."
--    description (EN): "Two teams of roughly equal size grip opposite ends of a
--      long rope and pull, trying to drag the other side across a line drawn in
--      the dirt. Loud, chant-heavy, and a fixture of Khmer New Year fairgrounds."
--    players (EN): "6 or more per side"
--    materials (EN): "A long, sturdy rope (or knotted cloth for younger kids)"
update entries set
  tagline_km = 'ល្បែងប្រជាប្រិយខ្មែរដែលអ្នកលេងពីរក្រុមប្រើកម្លាំងទាញខ្សែព្រ័ត្រប្រកួតគ្នា ដែលតែងតែលេងក្នុងពិធីបុណ្យ និងពិធីបុណ្យចូលឆ្នាំថ្មីប្រពៃណីខ្មែរ។',
  description_km = 'អ្នកលេងពីរក្រុមដែលមានចំនួន និងកម្លាំងប្រហាក់ប្រហែលគ្នា ចាប់កាន់ចុងសងខាងនៃខ្សែព្រ័ត្រវែងមួយ ហើយទាញព្យាយាមធ្វើឱ្យក្រុមម្ខាងទៀតឆ្លងកាត់បន្ទាត់ដែលគូសលើដី។ ល្បែងនេះពោរពេញដោយសំឡេងស្រែកហ៊ោ និងការស្រែកចង្វាក់លើកទឹកចិត្តគ្នា ហើយជាល្បែងពេញនិយមនៅតាមទីលានកម្សាន្តក្នុងឱកាសបុណ្យចូលឆ្នាំខ្មែរ។',
  players_km = 'អ្នកលេងចាប់ពី ៦ នាក់ឡើងទៅក្នុងមួយក្រុម។',
  materials_km = 'ខ្សែព្រ័ត្រវែង និងរឹងមាំមួយ ឬក្រណាត់ចងភ្ជាប់គ្នាសម្រាប់កុមារតូចៗ។',
  steps_km = array[
    'គូសខ្សែបន្ទាត់មួយនៅលើដី ឬដាក់សញ្ញាសម្គាល់ដើម្បីកំណត់ចំណុចកណ្តាល។',
    'បែងចែកអ្នកលេងជាពីរក្រុមដែលមានកម្លាំងប្រហាក់ប្រហែលគ្នា រួចឱ្យក្រុមនីមួយៗឈរជាជួរនៅសងខាងនៃបន្ទាត់កណ្តាល។',
    'អ្នកលេងទាំងពីរក្រុមចាប់កាន់ចុងម្ខាងនៃខ្សែព្រ័ត្រ ដោយចំណុចកណ្តាលនៃខ្សែព្រ័ត្រស្ថិតនៅលើបន្ទាត់កណ្តាល។',
    'នៅពេលទទួលសញ្ញាចាប់ផ្តើម ក្រុមទាំងពីរផ្អៀងខ្លួនទៅក្រោយ ហើយប្រើកម្លាំងទាញខ្សែព្រ័ត្រឱ្យអស់ពីសមត្ថភាព។',
    'ក្រុមដែលអាចទាញអ្នកលេងជួរមុខរបស់ក្រុមម្ខាងទៀតឱ្យឆ្លងកាត់បន្ទាត់កណ្តាលបានមុន គឺជាក្រុមឈ្នះក្នុងជុំនោះ។',
    'ជាទូទៅ គេប្រកួតចំនួន ៣ ជុំ ដើម្បីកំណត់ក្រុមឈ្នះ ដោយក្រុមដែលឈ្នះច្រើនជាងគេគឺជាអ្នកឈ្នះចុងក្រោយ។'
  ]
where slug = 'teanh-prot';
-- 5. Chab Kon Klaeng  (ចាប់កូនខ្លែង)
--    tagline (EN): "A winding chain game where a 'mother hen' shields her chicks from a hawk."
--    description (EN): "Players form a chain behind a lead 'mother' player while
--      a 'hawk' tries to tag the last person in line. The whole line snakes and
--      turns to protect its tail."
--    players (EN): "8–20 players plus one hawk"
--    materials (EN): "None — just open space to run"
update entries set
  tagline_km = 'ល្បែងប្រជាប្រិយដែលអ្នកលេងតម្រង់ជួរតាមក្រោយមេមាន់ ដើម្បីការពារកូនមាន់ពីសត្វស្ទាំងដែលព្យាយាមចាប់អ្នកលេងនៅចុងជួរ។',
  description_km = 'អ្នកលេងតម្រង់ជាជួរតាមក្រោយអ្នកលេងម្នាក់ដែលដើរតួជាមេមាន់ ខណៈដែលអ្នកលេងម្នាក់ទៀតដើរតួជាសត្វស្ទាំង ហើយព្យាយាមចាប់អ្នកលេងនៅចុងក្រោយនៃជួរ។ អ្នកលេងទាំងអស់ត្រូវរេរា និងបត់បែនតាមចលនារបស់មេមាន់ ដើម្បីការពារអ្នកលេងនៅចុងជួរ។',
  players_km = 'អ្នកលេងពី ៨ ទៅ ២០ នាក់ បូករួមទាំងសត្វស្ទាំងម្នាក់ទៀត។',
  materials_km = 'មិនត្រូវការសម្ភារៈទេ គ្រាន់តែមានទីធ្លាទំនេរសម្រាប់រត់លេង។',
  steps_km = array[
    'ជ្រើសរើសអ្នកលេងម្នាក់ធ្វើជាសត្វស្ទាំង និងម្នាក់ទៀតធ្វើជាមេមាន់។ អ្នកលេងដែលនៅសល់ឈរតម្រង់ជួរនៅពីក្រោយមេមាន់ ដោយចាប់ចង្កេះអ្នកដែលឈរនៅខាងមុខខ្លួន។',
    'សត្វស្ទាំងឈរប្រឈមមុខនឹងមេមាន់ ដែលលាតដៃទាំងសងខាងដើម្បីរារាំងផ្លូវសត្វស្ទាំង។',
    'នៅពេលទទួលសញ្ញាចាប់ផ្តើម សត្វស្ទាំងព្យាយាមរត់គេចជុំវិញមេមាន់ ដើម្បីចាប់អ្នកលេងដែលឈរនៅចុងក្រោយនៃជួរ។',
    'អ្នកលេងទាំងអស់ក្នុងជួរត្រូវរេរា និងបត់បែនទៅតាមចលនារបស់មេមាន់ ដើម្បីការពារអ្នកលេងនៅចុងជួរមិនឱ្យសត្វស្ទាំងចាប់បាន។',
    'ប្រសិនបើសត្វស្ទាំងចាប់អ្នកលេងនៅចុងជួរបាន អ្នកលេងនោះត្រូវចេញពីការលេង ឬក្លាយជាសត្វស្ទាំងថ្មី អាស្រ័យលើក្បួនលេងតាមតំបន់នីមួយៗ។',
    'ល្បែងបន្តរហូតដល់នៅសល់កូនមាន់តែប៉ុន្មាននាក់ ឬរហូតដល់អ្នកលេងទាំងអស់សើចសប្បាយ និងអស់កម្លាំង។'
  ]
where slug = 'chab-kon-klaeng';

-- 6. Muek Jumping Game  (ល្បែងលោតមឹក)
--    tagline (EN): "A traditional jumping game where children hop through a squid-shaped drawing on the ground."
--    description (EN): "Players take turns jumping through the different sections
--      of a squid-shaped figure drawn on the ground, usually outdoors in an open
--      space such as a yard or village area."
--    players (EN): "2–4 players"
--    materials (EN): "Chalk, stick, or anything that can be used to draw on the ground"
update entries set
  tagline_km = 'ល្បែងប្រជាប្រិយដែលកុមារលោតឆ្លងកាត់ផ្នែកផ្សេងៗនៃរូបរាងមឹកដែលគូរនៅលើដី។',
  description_km = 'អ្នកលេងប្តូរវេនគ្នាលោតឆ្លងកាត់ផ្នែកផ្សេងៗនៃរូបរាងមឹកដែលគូរនៅលើដី។ ល្បែងនេះជាទូទៅលេងនៅខាងក្រៅ ក្នុងទីធ្លាផ្ទះ ឬតំបន់ទំនេរនៅក្នុងភូមិដែលមានកន្លែងគ្រប់គ្រាន់សម្រាប់លេង។',
  players_km = 'អ្នកលេងពី ២ ទៅ ៤ នាក់។',
  materials_km = 'ដីស ឈើ ឬសម្ភារៈផ្សេងទៀតដែលអាចប្រើសម្រាប់គូររូបនៅលើដី។',
  steps_km = array[
    'រកកន្លែងទំនេរ និងមានដីរាបស្មើ ដើម្បីឱ្យអ្នកលេងទាំងអស់អាចលេងបានដោយសុវត្ថិភាព។',
    'គូររូបរាងដូចមឹកនៅលើដី ហើយបែងចែករូបនោះជាផ្នែកៗ ដើម្បីឱ្យអ្នកលេងលោតឆ្លងកាត់។',
    'អ្នកលេងប្តូរវេនគ្នាឈរនៅចំណុចចាប់ផ្តើមនៃរូបដែលបានគូរ។',
    'លោតឆ្លងកាត់ផ្នែកផ្សេងៗនៃរូបរាងមឹក ដោយអនុវត្តតាមក្បួនដែលបានព្រមព្រៀងគ្នា។',
    'អ្នកលេងបន្តប្តូរវេនគ្នា ហើយព្យាយាមលោតឱ្យចប់ផ្លូវដោយមិនជាន់ចេញក្រៅបន្ទាត់ដែលបានគូរ។',
    'ល្បែងបន្តទៅតាមវេនរបស់អ្នកលេងម្នាក់ៗ ដោយអ្នកទាំងអស់គ្នាចូលរួមលោតលេង និងសប្បាយរីករាយជាមួយគ្នា។'
  ]
where slug = 'muek-jumping-game';

-- 7. Rubber Band Jumping Game  (លេងលូតកៅស៊ូ)
--    tagline (EN): "A traditional jumping game where children jump over a stretched rubber band at different heights."
--    description (EN): "Players take turns jumping over a long rubber band held
--      between two players. The rubber band starts low and is gradually raised
--      as the game continues."
--    players (EN): "3-10 players"
--    materials (EN): "A long rubber band or several rubber bands tied together"
update entries set
  tagline_km = 'ល្បែងប្រជាប្រិយដែលកុមារលោតរំលងខ្សែកៅស៊ូដែលទាញឱ្យតឹង ដោយបង្កើនកម្ពស់ខ្សែកៅស៊ូបន្តិចម្តងៗ។',
  description_km = 'អ្នកលេងប្តូរវេនគ្នាលោតរំលងខ្សែកៅស៊ូវែងមួយដែលចង ឬកាន់ដោយអ្នកលេងពីរនាក់។ ដំបូង ខ្សែកៅស៊ូត្រូវបានដាក់នៅកម្ពស់ទាប ហើយត្រូវលើកឱ្យខ្ពស់ឡើងបន្តិចម្តងៗនៅពេលល្បែងបន្ត។',
  players_km = 'អ្នកលេងពី ៣ ទៅ ១០ នាក់។',
  materials_km = 'ខ្សែកៅស៊ូវែងមួយ ឬខ្សែកៅស៊ូច្រើនដែលចងភ្ជាប់គ្នា។',
  steps_km = array[
    'រកកន្លែងទំនេរ និងមានដីរាបស្មើ ដើម្បីឱ្យអ្នកលេងទាំងអស់អាចលេងបានដោយសុវត្ថិភាព។',
    'ជ្រើសរើសអ្នកលេងពីរនាក់ឱ្យឈរប្រឈមមុខគ្នា ហើយចាប់កាន់ចុងម្ខាងនៃខ្សែកៅស៊ូម្នាក់មួយចុង ដើម្បីទាញឱ្យតឹង។',
    'ចាប់ផ្តើមដោយដាក់ខ្សែកៅស៊ូនៅកម្ពស់ទាប ជាធម្មតានៅត្រឹមកជើង។',
    'អ្នកលេងផ្សេងទៀតប្តូរវេនគ្នាលោតរំលងខ្សែកៅស៊ូ ដោយមិនឱ្យប៉ះខ្សែកៅស៊ូ។',
    'បន្ទាប់ពីអ្នកលេងទាំងអស់បានលោតរួចហើយ ត្រូវលើកខ្សែកៅស៊ូឱ្យខ្ពស់ជាងមុន ហើយបន្តលោតទៀត។',
    'អ្នកលេងដែលប៉ះ ឬជាន់លើខ្សែកៅស៊ូ អាចត្រូវចាត់ទុកថាចាញ់ ឬត្រូវលោតម្តងទៀត អាស្រ័យលើក្បួនលេងតាមតំបន់នីមួយៗ។',
    'បន្តលើកខ្សែកៅស៊ូឱ្យកាន់តែខ្ពស់ រហូតដល់នៅសល់អ្នកលេងតែម្នាក់ ឬប៉ុន្មាននាក់ប៉ុណ្ណោះដែលអាចលោតរំលងបានដោយជោគជ័យ។'
  ]
where slug = 'rubber-band-jumping-game';

-- 8. Stech Chong  (ស្តេចចង់)
--    tagline (EN): "A guessing game where two teams secretly name players and try to guess each other's choices."
--    description (EN): "Players divide into two equal teams and face each other
--      with a 'king' sitting between them. One team secretly whispers the name of
--      a player to the king; the other team tries to guess it, and the guessing
--      continues back and forth."
--    players (EN): "8–20 players plus one king"
--    materials (EN): "None — just an open space for two groups to sit or stand"
update entries set
  tagline_km = 'ល្បែងទាយឈ្មោះដែលអ្នកលេងចែកជាពីរក្រុម ហើយព្យាយាមទាយឈ្មោះអ្នកលេងដែលក្រុមម្ខាងទៀតបានប្រាប់ស្តេចដោយសម្ងាត់។',
  description_km = 'អ្នកលេងចែកជាពីរក្រុមដែលមានចំនួនស្មើគ្នា ហើយឈរឬអង្គុយប្រឈមមុខគ្នា ដោយមានស្តេចម្នាក់អង្គុយនៅចំកណ្តាល។ ក្រុមមួយខ្សឹបប្រាប់ឈ្មោះអ្នកលេងម្នាក់ពីក្រុមម្ខាងទៀតទៅកាន់ស្តេចដោយសម្ងាត់។ បន្ទាប់មក ក្រុមម្ខាងទៀតព្យាយាមទាយឈ្មោះនោះ ហើយក្រុមទាំងពីរបន្តប្តូរវេនគ្នាទាយ និងប្រាប់ឈ្មោះ។',
  players_km = 'អ្នកលេងពី ៨ ទៅ ២០ នាក់ បូករួមទាំងស្តេចម្នាក់។',
  materials_km = 'មិនត្រូវការសម្ភារៈទេ គ្រាន់តែមានទីធ្លាទំនេរសម្រាប់ក្រុមទាំងពីរអង្គុយ ឬឈរ។',
  steps_km = array[
    'បែងចែកអ្នកលេងជាពីរក្រុមដែលមានចំនួនស្មើគ្នា។ តាមទំនៀមទម្លាប់ ក្រុមមួយអាចជាក្រុមក្មេងប្រុស និងក្រុមមួយទៀតជាក្រុមក្មេងស្រី។',
    'ឱ្យក្រុមទាំងពីរអង្គុយ ឬឈរប្រឈមមុខគ្នា ដោយមានចន្លោះគ្រប់គ្រាន់រវាងក្រុមទាំងពីរ។',
    'ជ្រើសរើសមនុស្សម្នាក់ធ្វើជា «ស្តេច» ហើយឱ្យគាត់អង្គុយនៅចំកណ្តាលរវាងក្រុមទាំងពីរ។',
    'អ្នកលេងម្នាក់ពីក្រុមចាប់ផ្តើមដើរទៅជិតស្តេច បិទត្រចៀកស្តេច រួចខ្សឹបប្រាប់ឈ្មោះអ្នកលេងម្នាក់ពីក្រុមម្ខាងទៀតដោយសម្ងាត់។',
    'បន្ទាប់មក អ្នកលេងពីក្រុមម្ខាងទៀតប្តូរវេនគ្នាចូលទៅជិតស្តេច ដើម្បីទាយឈ្មោះដែលបានខ្សឹបប្រាប់។',
    'ប្រសិនបើអ្នកលេងណាម្នាក់ទាយឈ្មោះបានត្រឹមត្រូវ ស្តេចនឹងស្រែកថា «ស្តេចចង់!» ហើយអ្នកដែលត្រូវបានគេនិយាយឈ្មោះនឹងត្រូវចាប់យកដោយក្រុមម្ខាងទៀត។',
    'ប្រសិនបើការទាយមិនត្រឹមត្រូវ អ្នកលេងនោះមានឱកាសខ្សឹបប្រាប់ឈ្មោះអ្នកលេងម្នាក់ពីក្រុមម្ខាងទៀតទៅកាន់ស្តេចវិញ។',
    'ក្រុមទាំងពីរបន្តប្តូរវេនគ្នាទាយឈ្មោះ និងជ្រើសរើសអ្នកលេងរហូតដល់ក្រុមមួយបាត់បង់អ្នកលេងទាំងអស់ ឬភាគច្រើន។',
    'ក្រុមដែលចាញ់អាចទទួលការដាក់ទណ្ឌកម្មបែបកម្សាន្តដែលបានព្រមព្រៀងគ្នា ដូចជា ច្រៀង រាំ ធ្វើត្រាប់តាមសត្វ ឬសែងសមាជិកម្នាក់នៃក្រុមឈ្នះ។'
  ]
where slug = 'stech-chong';

-- ───────────────────────────────────────────────────────────────────────────
-- Worked example (steps) — translate each line of how you play it, in order:
--   steps_km = array[
--     'First step in Khmer',
--     'Second step in Khmer',
--     ...
--   ]
-- For N steps, keep N strings. (Steps for each entry are listed in its English
-- description comments on 003_seed_entries.sql if you want the source.)
-- ───────────────────────────────────────────────────────────────────────────

-- ───────────────────────────────────────────────────────────────────────────
-- 9. English title correction — matches the archive's own transliteration.
--    The URL slug stays chab-kon-klaeng.
-- ───────────────────────────────────────────────────────────────────────────
update entries set title = 'Chab Kon Klaeng'
where slug = 'chab-kon-klaeng';