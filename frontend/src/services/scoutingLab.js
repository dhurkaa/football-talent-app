import { samplePlayers } from "./mockData";

const POSITION_ARCHETYPES = {
  GK: "Sweeper keeper",
  DEF: "Front-foot defender",
  CB: "Aerial organizer",
  MID: "Control midfielder",
  CM: "Two-way connector",
  FWD: "Vertical finisher",
  ST: "Penalty-box striker",
  LW: "Transition winger",
  RW: "Inverted creator"
};

const POSITION_ZONES = {
  GK: [9, 10, 13, 14],
  DEF: [1, 2, 5, 6, 9, 10],
  CB: [1, 2, 5, 6],
  MID: [4, 5, 6, 8, 9, 10],
  CM: [4, 5, 6, 8, 9, 10],
  FWD: [7, 8, 9, 10, 11, 12],
  ST: [9, 10, 13, 14],
  LW: [4, 8, 12, 16],
  RW: [1, 5, 9, 13]
};

const ARCHETYPE_LIBRARY = [
  {
    id: "alphonso-davies",
    name: "Left-back like Alphonso Davies",
    positionGroup: ["DEF", "LW"],
    vector: { pace: 96, shooting: 62, passing: 79, dribbling: 90, defending: 78, physical: 83 },
    styleTags: ["elite acceleration", "wide progression", "recovery speed", "high pressing intensity"]
  },
  {
    id: "rodri-controller",
    name: "Controller like Rodri",
    positionGroup: ["MID", "CM"],
    vector: { pace: 62, shooting: 73, passing: 94, dribbling: 82, defending: 84, physical: 84 },
    styleTags: ["control", "press resistance", "field tilt", "game management"]
  },
  {
    id: "saka-winger",
    name: "Wide creator like Bukayo Saka",
    positionGroup: ["RW", "LW", "FWD"],
    vector: { pace: 88, shooting: 82, passing: 84, dribbling: 90, defending: 58, physical: 76 },
    styleTags: ["winger", "final-third creation", "ball carrying", "press work"]
  },
  {
    id: "haaland-runner",
    name: "Penalty-box runner like Erling Haaland",
    positionGroup: ["ST", "FWD"],
    vector: { pace: 89, shooting: 96, passing: 62, dribbling: 72, defending: 34, physical: 92 },
    styleTags: ["finishing", "box movement", "aerial threat", "direct running"]
  }
];

const BENCHMARKS = {
  GK: { sprint30: 4.45, shotSpeed: 91, jumpHeight: 45, pace: 60, defending: 82 },
  DEF: { sprint30: 4.1, shotSpeed: 88, jumpHeight: 49, pace: 74, defending: 81 },
  CB: { sprint30: 4.18, shotSpeed: 89, jumpHeight: 51, pace: 70, defending: 85 },
  MID: { sprint30: 4.03, shotSpeed: 94, jumpHeight: 47, pace: 78, passing: 84 },
  CM: { sprint30: 4.0, shotSpeed: 93, jumpHeight: 48, pace: 77, passing: 85 },
  FWD: { sprint30: 3.92, shotSpeed: 103, jumpHeight: 50, pace: 87, shooting: 85 },
  ST: { sprint30: 3.94, shotSpeed: 105, jumpHeight: 53, pace: 84, shooting: 88 },
  LW: { sprint30: 3.88, shotSpeed: 99, jumpHeight: 48, pace: 90, dribbling: 86 },
  RW: { sprint30: 3.88, shotSpeed: 99, jumpHeight: 48, pace: 89, dribbling: 87 }
};

const zoneLabels = [
  "Left build",
  "Left half",
  "Central build",
  "Right build",
  "Left progress",
  "Left interior",
  "Central progress",
  "Right interior",
  "Left attack",
  "Left box",
  "Central attack",
  "Right box",
  "Right attack",
  "Right channel",
  "Penalty spot",
  "Far-post zone"
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const round = (value, digits = 1) => Number(value.toFixed(digits));

const dedupePlayers = (players) => {
  const byName = new Map();
  players.forEach((player, index) => {
    const key = `${player.name || player.fullName}-${player.club || ""}-${player.position || ""}`.toLowerCase();
    if (!byName.has(key)) {
      byName.set(key, { ...player, id: player.id || player._id || `pool-${index}` });
    }
  });
  return [...byName.values()];
};

export const getScoutingPlayerPool = (players = []) => dedupePlayers([...players, ...samplePlayers]).map(enrichPlayer);

export const enrichPlayer = (player) => {
  const skills = {
    pace: player.skills?.pace ?? 65,
    shooting: player.skills?.shooting ?? 60,
    passing: player.skills?.passing ?? 60,
    dribbling: player.skills?.dribbling ?? 60,
    defending: player.skills?.defending ?? 55,
    physical: player.skills?.physical ?? 60
  };
  const { pace, shooting, passing, dribbling, defending, physical } = skills;
  const sprintIndex = clamp(100 - ((4.9 - pace / 100) * 18 + (player.age || 22) * 0.1), 55, 99);
  const pressingIntensity = clamp((physical * 0.4 + pace * 0.35 + defending * 0.25) / 1, 45, 98);
  const coordination = clamp((dribbling * 0.45 + passing * 0.25 + physical * 0.15 + pace * 0.15) / 1, 45, 98);
  const finishing = clamp((shooting * 0.7 + dribbling * 0.2 + pace * 0.1) / 1, 30, 99);
  const gameIntel = clamp((passing * 0.45 + defending * 0.2 + dribbling * 0.2 + physical * 0.15) / 1, 40, 97);
  const acceleration = clamp(pace * 0.93 + physical * 0.07, 45, 99);
  const matchInfluence = clamp((player.goals || 0) * 2 + (player.assists || 0) * 1.6 + (player.rating || 7) * 8, 45, 99);

  return {
    ...player,
    skills,
    archetype: POSITION_ARCHETYPES[player.position] || POSITION_ARCHETYPES[player.apiPosition] || "Flexible profile",
    labMetrics: {
      acceleration: round(acceleration),
      sprintIndex: round(sprintIndex),
      pressingIntensity: round(pressingIntensity),
      coordination: round(coordination),
      finishing: round(finishing),
      gameIntel: round(gameIntel),
      matchInfluence: round(matchInfluence)
    }
  };
};

export const getReferenceProfiles = () => ARCHETYPE_LIBRARY;

export const similaritySearch = ({ players = [], referenceId, referencePlayerId, customReference }) => {
  const pool = getScoutingPlayerPool(players);
  const refProfile =
    ARCHETYPE_LIBRARY.find((item) => item.id === referenceId) ||
    pool.find((item) => item.id === referencePlayerId) ||
    customReference;

  if (!refProfile) {
    return [];
  }

  const referenceVector = refProfile.vector || refProfile.skills || {};
  const allowedPositions = refProfile.positionGroup || (refProfile.position ? [refProfile.position] : []);

  return pool
    .filter((player) => !referencePlayerId || player.id !== referencePlayerId)
    .map((player) => {
      const weights = {
        pace: 1.1,
        shooting: 1,
        passing: 1,
        dribbling: 1.05,
        defending: 1,
        physical: 1
      };

      const score = Object.keys(weights).reduce((sum, key) => {
        const referenceValue = referenceVector[key] ?? 60;
        const playerValue = player.skills?.[key] ?? 60;
        const closeness = 100 - Math.abs(referenceValue - playerValue);
        return sum + closeness * weights[key];
      }, 0) / Object.keys(weights).reduce((sum, key) => sum + weights[key], 0);

      const positionBonus = !allowedPositions.length || allowedPositions.includes(player.position) ? 6 : 0;
      const tagBonus = (refProfile.styleTags || []).reduce((sum, tag) => {
        if (tag.includes("acceleration")) return sum + player.labMetrics.acceleration / 35;
        if (tag.includes("press")) return sum + player.labMetrics.pressingIntensity / 40;
        if (tag.includes("control")) return sum + player.skills.passing / 45;
        if (tag.includes("finishing")) return sum + player.labMetrics.finishing / 40;
        return sum + 1;
      }, 0);

      return {
        ...player,
        similarity: round(clamp(score + positionBonus + tagBonus, 0, 100)),
        matchReasons: [
          `Acceleration ${player.labMetrics.acceleration}`,
          `Pressing intensity ${player.labMetrics.pressingIntensity}`,
          `Technical fit ${round((player.skills.passing + player.skills.dribbling + player.skills.shooting) / 3)}`
        ]
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 8);
};

export const buildTalentFingerprint = (player) => {
  const enriched = enrichPlayer(player);
  const zones = new Array(16).fill(0).map((_, index) => {
    const hotZones = POSITION_ZONES[enriched.position] || POSITION_ZONES.FWD;
    const inPrimaryZone = hotZones.includes(index + 1);
    const bias = inPrimaryZone ? 18 : 4;
    const technicalBoost = (enriched.skills.dribbling + enriched.skills.passing + enriched.skills.shooting) / 18;
    const physicalBoost = (enriched.skills.pace + enriched.skills.physical) / 22;
    return round(clamp(bias + technicalBoost + physicalBoost - (index % 4) * 1.2, 2, 24));
  });

  const radar = {
    physical: round((enriched.skills.pace + enriched.skills.physical) / 2),
    technical: round((enriched.skills.passing + enriched.skills.dribbling + enriched.skills.shooting) / 3),
    tactical: round((enriched.labMetrics.gameIntel + enriched.labMetrics.pressingIntensity) / 2),
    creativity: round((enriched.skills.passing + enriched.skills.dribbling) / 2),
    duelPower: round((enriched.skills.defending + enriched.skills.physical) / 2),
    endProduct: round((enriched.labMetrics.finishing + enriched.matchInfluence) / 2)
  };

  return {
    radar,
    heatmap: zones.map((value, index) => ({ label: zoneLabels[index], value }))
  };
};

export const compareToBenchmarks = (player, testingData = {}) => {
  const enriched = enrichPlayer(player);
  const benchmark = BENCHMARKS[enriched.position] || BENCHMARKS.FWD;
  const ageBand = enriched.age <= 16 ? "U16" : enriched.age <= 18 ? "U18" : enriched.age <= 21 ? "U21" : "Senior";
  const maturityOffset = enriched.age <= 16 ? -4 : enriched.age <= 18 ? -2 : 0;
  const adjusted = Object.fromEntries(Object.entries(benchmark).map(([key, value]) => [key, typeof value === "number" ? value + maturityOffset : value]));

  const metrics = [
    {
      label: "Acceleration",
      player: enriched.labMetrics.acceleration,
      benchmark: adjusted.pace || 75,
      direction: "higher"
    },
    {
      label: "Technical execution",
      player: round((enriched.skills.passing + enriched.skills.dribbling) / 2),
      benchmark: adjusted.passing || 76,
      direction: "higher"
    },
    {
      label: "Sprint 30m",
      player: testingData.sprint30 || round(4.95 - enriched.skills.pace / 100, 2),
      benchmark: adjusted.sprint30,
      direction: "lower"
    },
    {
      label: "Shot speed",
      player: testingData.shotSpeed || round(62 + enriched.skills.shooting * 0.48),
      benchmark: adjusted.shotSpeed,
      direction: "higher"
    },
    {
      label: "Jump height",
      player: testingData.jumpHeight || round(28 + enriched.skills.physical * 0.28),
      benchmark: adjusted.jumpHeight,
      direction: "higher"
    }
  ].map((metric) => {
    const delta = metric.direction === "lower" ? round(metric.benchmark - metric.player, 2) : round(metric.player - metric.benchmark, 2);
    return {
      ...metric,
      delta,
      status: delta >= 4 ? "ahead" : delta >= 0 ? "on track" : "behind"
    };
  });

  return {
    ageBand,
    maturityLabel: `${ageBand} ${enriched.position} benchmark`,
    summary:
      metrics.filter((item) => item.status === "ahead").length >= 3
        ? "Tracking above age-and-role benchmark on the majority of current measures."
        : "Shows a mixed benchmark picture, with upside in some areas and clear development work in others.",
    metrics
  };
};

export const generateBackgroundDossier = (player) => {
  const enriched = enrichPlayer(player);
  const valueBand = enriched.marketValue || "Not set";
  return {
    headline: `${enriched.name} profiles as a ${enriched.archetype.toLowerCase()} with ${enriched.labMetrics.matchInfluence} match-influence grade.`,
    injuryHistory: `${enriched.name} has no verified medical red flags in the current workspace dataset; treat this as public-signal only until club-side diligence is complete.`,
    transferContext: `${enriched.club} would likely position the deal around ${valueBand} with leverage driven by ${enriched.status?.toLowerCase() || "current form"}.`,
    mediaSignals: [
      `${enriched.nationality} talent-watch chatter is strongest around ${enriched.skills.pace >= 85 ? "athletic upside" : "technical quality"}.`,
      `${enriched.recentForm?.[0] || "Recent form data suggests steady upward momentum."}`,
      `${enriched.comparisons?.[0] || "Scouting language consistently frames the player as role-specific rather than system-limited."}`
    ],
    quotes: [
      `Scout summary: ${enriched.scoutSummary}`,
      `Development lens: ${(enriched.developmentAreas || ["No development areas logged yet."])[0]}`
    ]
  };
};

export const createTalentAlerts = ({ players = [], filters = {} }) => {
  const pool = getScoutingPlayerPool(players);
  const matches = pool.filter((player) => {
    if (filters.position && player.position !== filters.position) return false;
    if (filters.maxAge && (player.age || 0) > Number(filters.maxAge)) return false;
    if (filters.minAcceleration && player.labMetrics.acceleration < Number(filters.minAcceleration)) return false;
    if (filters.minPressing && player.labMetrics.pressingIntensity < Number(filters.minPressing)) return false;
    if (filters.minRating && (player.rating || 0) < Number(filters.minRating)) return false;
    return true;
  });

  return matches.slice(0, 6).map((player) => ({
    playerId: player.id,
    title: `${player.name} matches your profile`,
    note: `${player.position}, age ${player.age}, acceleration ${player.labMetrics.acceleration}, pressing ${player.labMetrics.pressingIntensity}.`,
    urgency: player.rating >= 8.7 || player.age <= 20 ? "High" : "Medium"
  }));
};

export const analyzeDrillUploads = (drills = []) => {
  const results = drills.map((drill, index) => {
    const time = Number(drill.timeSeconds || 0);
    const quality = Number(drill.quality || 0);
    const reps = Number(drill.repetitions || 1);
    const drillFactor =
      drill.type === "sprint" ? 1.15 : drill.type === "agility" ? 1.05 : drill.type === "finishing" ? 1.1 : 1;
    const speedScore = clamp(100 - time * 9 * drillFactor + reps * 2.5, 40, 99);
    const techniqueScore = clamp(quality * 14 + reps * 3 + (drill.notes?.length || 0) * 0.3, 35, 98);
    const coordinationScore = clamp((speedScore * 0.35 + techniqueScore * 0.65) / 1, 38, 98);

    return {
      id: `drill-${index + 1}`,
      name: drill.label || `${drill.type} drill`,
      clipName: drill.fileName || "No file attached",
      speedScore: round(speedScore),
      techniqueScore: round(techniqueScore),
      coordinationScore: round(coordinationScore),
      summary:
        drill.type === "sprint"
          ? "Strong phone-based sprint read with repeat-speed context."
          : drill.type === "agility"
            ? "Footwork and direction changes project well from the logged execution quality."
            : "Finishing mechanics and repeatability are the main differentiators in this clip set."
    };
  });

  const composite =
    results.length > 0
      ? round(
          results.reduce(
            (sum, item) => sum + (item.speedScore + item.techniqueScore + item.coordinationScore) / 3,
            0
          ) / results.length
        )
      : 0;

  return {
    results,
    composite,
    recommendation:
      composite >= 85
        ? "Flag for follow-up capture and benchmark against top-priority prospects."
        : composite >= 72
          ? "Useful screening result; pair with match footage before escalation."
          : "Needs cleaner capture or stronger execution before this should influence recruitment."
  };
};

export const generateHighlightReel = ({ player, matchFileName, matchLabel }) => {
  const enriched = enrichPlayer(player);
  const touches = clamp(Math.round((enriched.matches || 24) * 1.3), 18, 68);
  const keyActions = [
    { type: "Touch cluster", count: Math.max(8, Math.round(touches * 0.42)) },
    { type: "Progressive actions", count: Math.max(4, Math.round(enriched.skills.dribbling / 18)) },
    { type: "Final-third actions", count: Math.max(3, Math.round(enriched.labMetrics.finishing / 22)) },
    { type: "Defensive interventions", count: Math.max(2, Math.round(enriched.skills.defending / 25)) }
  ];

  const clips = keyActions.flatMap((action, actionIndex) =>
    new Array(action.count).fill(null).slice(0, 3).map((_, clipIndex) => ({
      id: `${action.type}-${clipIndex}`,
      label: action.type,
      timestamp: `${String(8 + actionIndex * 17 + clipIndex * 6).padStart(2, "0")}:${String((clipIndex * 19) % 60).padStart(2, "0")}`,
      duration: `${6 + clipIndex}s`,
      description: `${enriched.name} ${action.type.toLowerCase()} from ${matchLabel || "uploaded match footage"}.`
    }))
  );

  return {
    title: `${enriched.name} auto highlight reel`,
    source: matchFileName || "Local upload",
    summary: `Generated a share-ready reel around ${touches} estimated touches and ${keyActions.reduce((sum, item) => sum + item.count, 0)} key actions.`,
    clips,
    reelNarrative: `${enriched.name} stands out through ${enriched.archetype.toLowerCase()}, with strongest reel value coming from ${enriched.skills.pace >= 85 ? "explosive actions in space" : "composure and action selection"}.`
  };
};

export const runScoutCopilot = ({ players = [], query }) => {
  const pool = getScoutingPlayerPool(players);
  const normalized = query.toLowerCase();
  const filters = {
    maxAge: normalized.includes("u17") ? 17 : normalized.includes("u19") ? 19 : normalized.includes("u21") ? 21 : null,
    position:
      normalized.includes("winger") ? null :
      normalized.includes("left-back") ? "DEF" :
      normalized.includes("striker") ? "ST" :
      normalized.includes("midfielder") ? "MID" : null
  };

  const positionMatches = (player) => {
    if (normalized.includes("winger")) return ["LW", "RW", "FWD"].includes(player.position);
    if (normalized.includes("left-back")) return ["DEF", "LW"].includes(player.position);
    if (normalized.includes("striker")) return ["ST", "FWD"].includes(player.position);
    if (normalized.includes("midfielder")) return ["MID", "CM"].includes(player.position);
    return true;
  };

  const filtered = pool
    .filter((player) => (!filters.maxAge || player.age <= filters.maxAge) && positionMatches(player))
    .filter((player) => {
      if (normalized.includes("elite acceleration") && player.labMetrics.acceleration < 86) return false;
      if (normalized.includes("high pressing intensity") && player.labMetrics.pressingIntensity < 78) return false;
      if (normalized.includes("press-resistant") && player.skills.passing < 82) return false;
      if (normalized.includes("finishing") && player.labMetrics.finishing < 82) return false;
      return true;
    })
    .sort((a, b) => {
      const aScore = a.labMetrics.acceleration + a.labMetrics.pressingIntensity + (a.rating || 0) * 6;
      const bScore = b.labMetrics.acceleration + b.labMetrics.pressingIntensity + (b.rating || 0) * 6;
      return bScore - aScore;
    })
    .slice(0, 5);

  const summary =
    filtered.length > 0
      ? `Found ${filtered.length} players matching the current prompt, with the strongest concentration in ${filtered[0].position} profiles that combine acceleration, action volume, and role clarity.`
      : "No players cleared all prompt filters, so the current profile may be too narrow for the available dataset.";

  return {
    summary,
    shortlist: filtered.map((player) => ({
      ...player,
      note: `${player.name} is a ${player.age}-year-old ${player.position} from ${player.club}. Best current fit: acceleration ${player.labMetrics.acceleration}, pressing ${player.labMetrics.pressingIntensity}, end product ${player.labMetrics.finishing}.`
    }))
  };
};

export const evaluateMobileLab = ({ sprint10, sprint30, shotSpeed, jumpHeight, sensorConfidence = 75 }) => {
  const accelerationScore = clamp(100 - Number(sprint10 || 2.1) * 28, 45, 99);
  const speedScore = clamp(100 - Number(sprint30 || 4.2) * 16, 45, 99);
  const powerScore = clamp(Number(shotSpeed || 90) * 0.78 + Number(jumpHeight || 35) * 0.35, 35, 99);
  const reliability = clamp(Number(sensorConfidence), 40, 100);

  return {
    accelerationScore: round(accelerationScore),
    speedScore: round(speedScore),
    powerScore: round(powerScore),
    reliability: round(reliability),
    summary:
      reliability >= 80
        ? "Sensor confidence is strong enough to embed this session into the player profile as a credible screening datapoint."
        : "Useful first-pass capture, but repeat the session before treating it as a high-confidence benchmark."
  };
};

export const buildExportSections = (player) => {
  const fingerprint = buildTalentFingerprint(player);
  const benchmark = compareToBenchmarks(player);
  const dossier = generateBackgroundDossier(player);

  return [
    {
      id: "profile",
      title: "Profile snapshot",
      content: `${player.name}, ${player.age}, ${player.position}, ${player.club}. ${player.scoutSummary}`
    },
    {
      id: "fingerprint",
      title: "Talent fingerprint",
      content: `Physical ${fingerprint.radar.physical}, Technical ${fingerprint.radar.technical}, Tactical ${fingerprint.radar.tactical}, End product ${fingerprint.radar.endProduct}.`
    },
    {
      id: "benchmarks",
      title: "Benchmark view",
      content: `${benchmark.maturityLabel}. ${benchmark.summary}`
    },
    {
      id: "dossier",
      title: "Background dossier",
      content: `${dossier.transferContext} ${dossier.mediaSignals[0]}`
    }
  ];
};
