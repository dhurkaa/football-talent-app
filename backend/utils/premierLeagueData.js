const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = {
  bootstrap: { data: null, fetchedAt: 0 },
  fixtures: { data: null, fetchedAt: 0 },
  playerSummaries: new Map()
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "FootballTalentApp/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Premier League data request failed with ${response.status}`);
  }

  return response.json();
};

const isFresh = (entry) => entry.data && Date.now() - entry.fetchedAt < CACHE_TTL_MS;

const getPremierLeagueBootstrap = async () => {
  if (isFresh(cache.bootstrap)) {
    return cache.bootstrap.data;
  }

  const data = await fetchJson("https://fantasy.premierleague.com/api/bootstrap-static/");
  cache.bootstrap = {
    data,
    fetchedAt: Date.now()
  };
  return data;
};

const getPremierLeagueFixtures = async () => {
  if (isFresh(cache.fixtures)) {
    return cache.fixtures.data;
  }

  const data = await fetchJson("https://fantasy.premierleague.com/api/fixtures/");
  cache.fixtures = {
    data,
    fetchedAt: Date.now()
  };
  return data;
};

const getPlayerSummary = async (playerId) => {
  const existing = cache.playerSummaries.get(playerId);
  if (existing && isFresh(existing)) {
    return existing.data;
  }

  const data = await fetchJson(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`);
  cache.playerSummaries.set(playerId, {
    data,
    fetchedAt: Date.now()
  });
  return data;
};

const mapPosition = (elementTypeId, elementTypes) =>
  elementTypes.find((item) => item.id === elementTypeId)?.singular_name || "Unknown";

const normalizePremierLeaguePlayer = (player, teamMap, elementTypes) => ({
  id: player.id,
  teamId: player.team,
  teamName: teamMap.get(player.team)?.name || "Unknown Team",
  firstName: player.first_name,
  secondName: player.second_name,
  webName: player.web_name,
  displayName: `${player.first_name} ${player.second_name}`.trim(),
  position: mapPosition(player.element_type, elementTypes),
  status: player.status,
  shirtNumber: player.squad_number,
  currentPrice: Number(player.now_cost) / 10,
  selectedByPercent: Number(player.selected_by_percent),
  totalPoints: player.total_points,
  pointsPerGame: Number(player.points_per_game),
  minutes: player.minutes,
  starts: player.starts,
  goals: player.goals_scored,
  assists: player.assists,
  cleanSheets: player.clean_sheets,
  goalsConceded: player.goals_conceded,
  saves: player.saves,
  bonus: player.bonus,
  bps: player.bps,
  influence: Number(player.influence),
  creativity: Number(player.creativity),
  threat: Number(player.threat),
  ictIndex: Number(player.ict_index),
  expectedGoals: Number(player.expected_goals),
  expectedAssists: Number(player.expected_assists),
  expectedGoalInvolvements: Number(player.expected_goal_involvements),
  expectedGoalsConceded: Number(player.expected_goals_conceded),
  yellowCards: player.yellow_cards,
  redCards: player.red_cards,
  news: player.news,
  photo: player.photo,
  birthDate: player.birth_date
});

const buildTeamStats = (teamId, fixtures) => {
  const completed = fixtures.filter(
    (fixture) => fixture.finished && (fixture.team_h === teamId || fixture.team_a === teamId)
  );

  const stats = completed.reduce(
    (acc, fixture) => {
      const isHome = fixture.team_h === teamId;
      const goalsFor = isHome ? fixture.team_h_score : fixture.team_a_score;
      const goalsAgainst = isHome ? fixture.team_a_score : fixture.team_h_score;

      acc.played += 1;
      acc.goalsFor += goalsFor;
      acc.goalsAgainst += goalsAgainst;

      if (goalsFor > goalsAgainst) {
        acc.wins += 1;
        acc.points += 3;
      } else if (goalsFor === goalsAgainst) {
        acc.draws += 1;
        acc.points += 1;
      } else {
        acc.losses += 1;
      }

      return acc;
    },
    {
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0
    }
  );

  return {
    ...stats,
    goalDifference: stats.goalsFor - stats.goalsAgainst
  };
};

const normalizeFixture = (fixture, teamMap) => ({
  id: fixture.id,
  event: fixture.event,
  kickoffTime: fixture.kickoff_time,
  finished: fixture.finished,
  started: fixture.started,
  homeTeamId: fixture.team_h,
  awayTeamId: fixture.team_a,
  homeTeam: teamMap.get(fixture.team_h)?.name || "Unknown Team",
  awayTeam: teamMap.get(fixture.team_a)?.name || "Unknown Team",
  homeScore: fixture.team_h_score,
  awayScore: fixture.team_a_score,
  homeDifficulty: fixture.team_h_difficulty,
  awayDifficulty: fixture.team_a_difficulty,
  stats: fixture.stats || []
});

const validateScoutSelection = async (teamId, playerId) => {
  const bootstrap = await getPremierLeagueBootstrap();
  const team = bootstrap.teams.find((item) => item.id === Number(teamId));
  const player = bootstrap.elements.find((item) => item.id === Number(playerId));

  if (!team) {
    throw new Error("Selected Premier League team was not found");
  }

  if (!player || player.team !== team.id) {
    throw new Error("Selected player does not belong to the selected Premier League team");
  }

  return { team, player };
};

module.exports = {
  buildTeamStats,
  getPlayerSummary,
  getPremierLeagueBootstrap,
  getPremierLeagueFixtures,
  normalizeFixture,
  normalizePremierLeaguePlayer,
  validateScoutSelection
};
