// Sample entries. Replace contributor / place / text with real submissions,
// or wire this up to a CMS or database later.

const games = [
  {
    slug: "chol-chhoung",
    nameKhmer: "ចោលឈូង",
    nameEnglish: "Chol Chhoung",
    tagline: "A rolled-cloth throwing game played in a circle at Khmer New Year.",
    description:
      "Players split into two lines facing each other and take turns throwing a tightly rolled cloth ball, the chhoung, across the circle while singing call-and-response verses. Whoever is tagged has to dance for the group before the game continues.",
    players: "8–20 players, in two teams",
    materials: "A krama (scarf) rolled and knotted into a ball",
    contributor: "Sophea Ly",
    place: "Prey Veng",
    image: "/images/chol-chhoung.jpg",
    steps: [
      "Split everyone into two even lines standing a few metres apart, facing each other.",
      "One team rolls the krama tightly and knots it into a ball — this is the chhoung.",
      "A player from one line sings a short verse, then throws the chhoung toward the other line.",
      "Players on the receiving line try to catch it or dodge it; whoever it lands on (or fails to catch it) is 'tagged'.",
      "The tagged player is called to the middle to dance while the group sings and claps along.",
      "Play continues, alternating throws, until everyone is tired or the sun goes down.",
    ],
  },
  {
    slug: "leak-kanseng",
    nameKhmer: "លាក់កន្សែង",
    nameEnglish: "Leak Kanseng",
    tagline: "A hide-the-scarf chasing game, close cousin of duck-duck-goose.",
    description:
      "Children sit in a circle with their eyes closed and hands open behind their backs while one player quietly circles the outside with a rolled scarf, trying to drop it behind someone without being noticed before it's too late.",
    players: "6–15 players, one at a time is 'it'",
    materials: "A rolled krama or any small scarf",
    contributor: "Vantha Chan",
    place: "Prey Veng",
    image: "/images/leak-kanseng.png",
    steps: [
      "Everyone sits cross-legged in a circle, facing inward with eyes closed and hands open behind their backs.",
      "One player, holding the rolled scarf, walks quietly around the outside of the circle.",
      "They drop the scarf behind any player without being seen, then keep walking as if empty-handed.",
      "Players occasionally feel behind themselves to check if the scarf has landed there.",
      "If a player finds the scarf behind them, they jump up and chase the dropper around the circle.",
      "If caught before reaching the empty spot, the dropper repeats their turn; if not, the caught player becomes the new dropper.",
    ],
  },
  {
    slug: "bos-angkunh",
    nameKhmer: "បោះអង្គញ់",
    nameEnglish: "Bos Angkunh",
    tagline: "A precision throwing game played with the hard seeds of the angkunh tree.",
    description:
      "Two teams take turns setting up rows of angkunh seeds on the ground and trying to knock them down using a single seed held between the toes and flicked by hand — part marksmanship, part balance.",
    players: "4–12 players, in two teams",
    materials: "A handful of dried angkunh seeds",
    contributor: "Bunthoeun Prak",
    place: "Prey Veng",
    image: "/images/bos-angkunh.webp",
    steps: [
      "One team lines up several angkunh seeds standing upright in a row on flat ground — this is the target row.",
      "The other team stands back at an agreed distance, each with a throwing seed.",
      "A thrower balances their seed between two toes, then flicks it forward by hand to knock over target seeds.",
      "Knocked-over seeds are collected as points for the throwing team.",
      "Once every thrower has had a turn, the teams switch roles.",
      "The game continues for an agreed number of rounds; the team with the most collected seeds wins.",
    ],
  },
  {
    slug: "teanh-prot",
    nameKhmer: "ទាញព្រ័ត្រ",
    nameEnglish: "Teanh Prot",
    tagline: "Tug-of-war, played at festivals with rope, cloth, or bare hands.",
    description:
      "Two teams of roughly equal size grip opposite ends of a long rope and pull, trying to drag the other side across a line drawn in the dirt. Loud, chant-heavy, and a fixture of Khmer New Year fairgrounds.",
    players: "6 or more per side",
    materials: "A long, sturdy rope (or knotted cloth for younger kids)",
    contributor: "Chenda Meas",
    place: "Prey Veng",
    image: "/images/teanh-prot.jpg",
    steps: [
      "Draw a line in the dirt or lay down a marker to represent the centre point.",
      "Split players into two teams of roughly equal strength and line them up on either side of the line.",
      "Both teams grip the rope, with the centre of the rope over the line.",
      "On a signal, both teams lean back and pull as hard as they can.",
      "The first team to drag the other team's front player across the centre line wins the round.",
      "Best of three rounds is the usual way to settle it.",
    ],
  },
  {
    slug: "chab-kon-kaeb",
    nameKhmer: "ចាប់កូនកែម",
    nameEnglish: "Chab Kon Kaeb",
    tagline: "A winding chain game where a 'mother hen' shields her chicks from a hawk.",
    description:
      "Players form a chain behind a lead 'mother' player, hands on the shoulders or waist of the person in front, while a 'hawk' tries to tag the last person in line. The whole line snakes and turns to protect its tail.",
    players: "8–20 players plus one hawk",
    materials: "None — just open space to run",
    contributor: "Rithy Sok",
    place: "Prey Veng",
    image: "/images/chab-kon-kaeb.jpg",
    steps: [
      "Choose one player to be the hawk and one to be the mother; everyone else lines up behind the mother, holding the waist of the person in front.",
      "The hawk stands facing the mother, who spreads her arms to block the hawk's path.",
      "On a signal, the hawk tries to dart around the mother to tag the last player in the chain.",
      "The chain swings and turns together, following the mother's lead to keep the last player out of reach.",
      "If the hawk tags the last player, that player is out (or becomes the new hawk, depending on local rules).",
      "Play continues until only a few chicks remain, or everyone collapses laughing.",
    ],
  },
];

export default games;

export function getGameBySlug(slug) {
  return games.find((game) => game.slug === slug);
}
