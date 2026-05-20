import { KOSOVO_SQUAD, UEFA_SQUAD_SOURCE } from "../data/kosovoSquad";

const WIKIDATA_ENDPOINT = "https://query.wikidata.org/sparql";
const CACHE_KEY = "football_talent_kosovo_wikidata_v2";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

const WIKIDATA_QUERY = `
SELECT ?player ?playerLabel ?dob ?image ?positionLabel ?birthPlaceLabel ?article (GROUP_CONCAT(DISTINCT ?teamLabel; separator=" | ") AS ?teams) WHERE {
  ?player wdt:P106 wd:Q937857.
  { ?player wdt:P27 wd:Q1246. }
  UNION { ?player wdt:P54 wd:Q60670488. }
  UNION { ?player wdt:P1532 wd:Q1246. }
  ?player rdfs:label ?playerLabel.
  FILTER(LANG(?playerLabel) = "en")
  FILTER NOT EXISTS { ?player wdt:P570 ?dateOfDeath. }
  OPTIONAL { ?player wdt:P569 ?dob. }
  OPTIONAL { ?player wdt:P18 ?image. }
  OPTIONAL {
    ?player wdt:P413 ?position.
    ?position rdfs:label ?positionLabel.
    FILTER(LANG(?positionLabel) = "en")
  }
  OPTIONAL {
    ?player wdt:P19 ?birthPlace.
    ?birthPlace rdfs:label ?birthPlaceLabel.
    FILTER(LANG(?birthPlaceLabel) = "en")
  }
  OPTIONAL {
    ?player p:P54 ?clubStatement.
    ?clubStatement ps:P54 ?team.
    FILTER(?team != wd:Q60670488)
    FILTER NOT EXISTS { ?clubStatement pq:P582 ?ended. }
    ?team rdfs:label ?teamLabel.
    FILTER(LANG(?teamLabel) = "en")
  }
  OPTIONAL {
    ?article schema:about ?player;
      schema:isPartOf <https://en.wikipedia.org/>.
  }
}
GROUP BY ?player ?playerLabel ?dob ?image ?positionLabel ?birthPlaceLabel ?article
ORDER BY DESC(?dob)
LIMIT 120
`;

const POSITION_KEYWORDS = [
  ["Goalkeeper", ["goalkeeper"]],
  [
    "Defender",
    [
      "defender",
      "back",
      "centre-back",
      "center-back",
      "full-back",
      "left-back",
      "right-back",
    ],
  ],
  [
    "Forward",
    ["forward", "striker", "winger", "centre-forward", "center-forward"],
  ],
  ["Midfielder", ["midfielder", "midfield"]],
];

const normalizeName = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const calculateAge = (dateString) => {
  if (!dateString) return null;

  const birthday = new Date(dateString);
  if (Number.isNaN(birthday.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age -= 1;
  }

  return age;
};

const normalizePosition = (position = "") => {
  const value = position.toLowerCase();
  const match = POSITION_KEYWORDS.find(([, keywords]) =>
    keywords.some((keyword) => value.includes(keyword))
  );

  return match?.[0] || "Midfielder";
};

const getCachedLivePlayers = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      !parsed?.fetchedAt ||
      !Array.isArray(parsed.players) ||
      parsed.players.length === 0 ||
      Date.now() - parsed.fetchedAt > CACHE_TTL_MS
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const setCachedLivePlayers = (payload) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Cache failures should never prevent the player board from rendering.
  }
};

const cleanClubList = (teams = "") =>
  teams
    .split("|")
    .map((team) => team.trim())
    .filter(Boolean)
    .filter((team) => !/national|under-|under \d|u-\d|u\d/i.test(team))
    .filter((team, index, list) => list.indexOf(team) === index)
    .slice(0, 3);

const mapWikidataRow = (row) => {
  const name = row.playerLabel?.value || "Unknown player";
  const position = row.positionLabel?.value || "";
  const dob = row.dob?.value || "";

  return {
    id: row.player?.value?.split("/").pop() || normalizeName(name),
    fullName: name,
    age: calculateAge(dob),
    dateOfBirth: dob ? dob.slice(0, 10) : "",
    positionDetail: position,
    positionGroup: normalizePosition(position),
    birthPlace: row.birthPlaceLabel?.value || "",
    image: row.image?.value || "",
    clubs: cleanClubList(row.teams?.value || ""),
    wikidataUrl: row.player?.value || "",
    wikipediaUrl: row.article?.value || "",
    sourceType: "Wikidata",
  };
};

const fetchWikidataPlayers = async ({ force = false } = {}) => {
  if (!force) {
    const cached = getCachedLivePlayers();
    if (cached) return { ...cached, fromCache: true };
  }

  const url = `${WIKIDATA_ENDPOINT}?format=json&query=${encodeURIComponent(
    WIKIDATA_QUERY
  )}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Wikidata returned ${response.status}`);
  }

  const data = await response.json();
  const players = (data.results?.bindings || []).map(mapWikidataRow);
  if (players.length === 0) {
    throw new Error("Wikidata returned no player records");
  }

  const payload = { players, fetchedAt: Date.now() };

  setCachedLivePlayers(payload);
  return { ...payload, fromCache: false };
};

const toSquadPlayer = (player, livePlayer) => ({
  ...player,
  age: player.age || livePlayer?.age || null,
  dateOfBirth: livePlayer?.dateOfBirth || "",
  positionDetail: livePlayer?.positionDetail || player.positionGroup,
  birthPlace: livePlayer?.birthPlace || "",
  image: livePlayer?.image || "",
  clubs: livePlayer?.clubs || [],
  wikidataUrl: livePlayer?.wikidataUrl || "",
  wikipediaUrl: livePlayer?.wikipediaUrl || "",
  sourceType: livePlayer ? "UEFA + Wikidata" : "UEFA",
  sourceUrl: UEFA_SQUAD_SOURCE.url,
  verifiedLabel: UEFA_SQUAD_SOURCE.accessedLabel,
  isSeniorSquad: true,
});

const toLiveOnlyPlayer = (player) => ({
  ...player,
  appearances: null,
  goals: null,
  goalsAgainst: null,
  shirtNumber: null,
  sourceUrl: player.wikipediaUrl || player.wikidataUrl,
  verifiedLabel: "Live public data from Wikidata",
  isSeniorSquad: false,
});

export const buildKosovoPlayerDataset = (livePlayers = []) => {
  const liveByName = new Map(
    livePlayers.map((player) => [normalizeName(player.fullName), player])
  );
  const squadNames = new Set(KOSOVO_SQUAD.map((player) => normalizeName(player.fullName)));

  const seniorSquad = KOSOVO_SQUAD.map((player) =>
    toSquadPlayer(player, liveByName.get(normalizeName(player.fullName)))
  );

  const liveOnly = livePlayers
    .filter((player) => !squadNames.has(normalizeName(player.fullName)))
    .filter((player) => player.age === null || player.age <= 33)
    .slice(0, 36)
    .map(toLiveOnlyPlayer);

  return [...seniorSquad, ...liveOnly];
};

export const getKosovoPlayerData = async ({ force = false } = {}) => {
  try {
    const live = await fetchWikidataPlayers({ force });

    return {
      players: buildKosovoPlayerDataset(live.players),
      liveCount: live.players.length,
      fetchedAt: live.fetchedAt,
      fromCache: live.fromCache,
      error: "",
    };
  } catch (error) {
    return {
      players: buildKosovoPlayerDataset(),
      liveCount: 0,
      fetchedAt: Date.now(),
      fromCache: false,
      error: error.message || "Live enrichment failed",
    };
  }
};

export const getInitialKosovoPlayerData = () => ({
  players: buildKosovoPlayerDataset(),
  liveCount: 0,
  fetchedAt: Date.now(),
  fromCache: false,
  error: "",
});
