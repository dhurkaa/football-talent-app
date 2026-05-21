const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  buildTeamStats,
  getPlayerSummary,
  getPremierLeagueBootstrap,
  getPremierLeagueFixtures,
  normalizeFixture,
  normalizePremierLeaguePlayer
} = require("../utils/premierLeagueData");

const router = express.Router();

router.get("/teams", async (req, res) => {
  try {
    const bootstrap = await getPremierLeagueBootstrap();
    const teams = bootstrap.teams
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((team) => ({
        id: team.id,
        name: team.name,
        shortName: team.short_name,
        code: team.code,
        strength: team.strength,
        pulseId: team.pulse_id
      }));

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/teams/:teamId/players", async (req, res) => {
  try {
    const bootstrap = await getPremierLeagueBootstrap();
    const teamMap = new Map(bootstrap.teams.map((team) => [team.id, team]));
    const players = bootstrap.elements
      .filter((player) => player.team === Number(req.params.teamId))
      .map((player) => normalizePremierLeaguePlayer(player, teamMap, bootstrap.element_types))
      .sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/teams/:teamId", async (req, res) => {
  try {
    const teamId = Number(req.params.teamId);
    const [bootstrap, fixtures] = await Promise.all([
      getPremierLeagueBootstrap(),
      getPremierLeagueFixtures()
    ]);
    const teamMap = new Map(bootstrap.teams.map((team) => [team.id, team]));
    const team = teamMap.get(teamId);

    if (!team) {
      return res.status(404).json({ message: "Premier League team not found" });
    }

    const squad = bootstrap.elements
      .filter((player) => player.team === teamId)
      .map((player) => normalizePremierLeaguePlayer(player, teamMap, bootstrap.element_types))
      .sort((a, b) => b.totalPoints - a.totalPoints);

    const teamFixtures = fixtures
      .filter((fixture) => fixture.team_h === teamId || fixture.team_a === teamId)
      .map((fixture) => normalizeFixture(fixture, teamMap))
      .sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime));

    res.json({
      team: {
        id: team.id,
        name: team.name,
        shortName: team.short_name,
        strength: team.strength,
        attackHome: team.strength_attack_home,
        attackAway: team.strength_attack_away,
        defenceHome: team.strength_defence_home,
        defenceAway: team.strength_defence_away
      },
      stats: buildTeamStats(teamId, fixtures),
      squad,
      fixtures: teamFixtures
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/players/:playerId", async (req, res) => {
  try {
    const playerId = Number(req.params.playerId);
    const [bootstrap, summary] = await Promise.all([
      getPremierLeagueBootstrap(),
      getPlayerSummary(playerId)
    ]);

    const teamMap = new Map(bootstrap.teams.map((team) => [team.id, team]));
    const player = bootstrap.elements.find((item) => item.id === playerId);

    if (!player) {
      return res.status(404).json({ message: "Premier League player not found" });
    }

    res.json({
      player: normalizePremierLeaguePlayer(player, teamMap, bootstrap.element_types),
      recentMatches: summary.history,
      upcomingFixtures: summary.fixtures,
      previousSeasons: summary.history_past
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/scout-workspace", protect, async (req, res) => {
  try {
    const [bootstrap, fixtures] = await Promise.all([
      getPremierLeagueBootstrap(),
      getPremierLeagueFixtures()
    ]);

    const teamMap = new Map(bootstrap.teams.map((team) => [team.id, team]));
    const teams = bootstrap.teams
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((team) => ({
        id: team.id,
        name: team.name,
        shortName: team.short_name
      }));

    const selectedTeamId = req.user.selectedPremierLeagueTeamId;
    const selectedPlayerId = req.user.selectedPremierLeaguePlayerId;

    const selectedTeam = selectedTeamId
      ? bootstrap.teams.find((team) => team.id === selectedTeamId)
      : null;
    const squad = selectedTeam
      ? bootstrap.elements
          .filter((player) => player.team === selectedTeam.id)
          .map((player) => normalizePremierLeaguePlayer(player, teamMap, bootstrap.element_types))
          .sort((a, b) => b.totalPoints - a.totalPoints)
      : [];

    const selectedPlayerRaw = selectedPlayerId
      ? bootstrap.elements.find((player) => player.id === selectedPlayerId)
      : null;

    let selectedPlayer = null;
    let selectedPlayerSummary = null;

    if (selectedPlayerRaw) {
      selectedPlayer = normalizePremierLeaguePlayer(selectedPlayerRaw, teamMap, bootstrap.element_types);
      selectedPlayerSummary = await getPlayerSummary(selectedPlayerId);
    }

    const teamFixtures = selectedTeam
      ? fixtures
          .filter((fixture) => fixture.team_h === selectedTeam.id || fixture.team_a === selectedTeam.id)
          .map((fixture) => normalizeFixture(fixture, teamMap))
          .sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime))
      : [];

    res.json({
      teams,
      selectedTeam: selectedTeam
        ? {
            id: selectedTeam.id,
            name: selectedTeam.name,
            shortName: selectedTeam.short_name,
            strength: selectedTeam.strength
          }
        : null,
      selectedTeamStats: selectedTeam ? buildTeamStats(selectedTeam.id, fixtures) : null,
      squad,
      fixtures: teamFixtures,
      selectedPlayer,
      selectedPlayerSummary: selectedPlayerSummary
        ? {
            recentMatches: selectedPlayerSummary.history,
            upcomingFixtures: selectedPlayerSummary.fixtures,
            previousSeasons: selectedPlayerSummary.history_past
          }
        : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
