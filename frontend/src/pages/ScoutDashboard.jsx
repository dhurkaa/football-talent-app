import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  HiCalendar,
  HiChartBar,
  HiClipboardList,
  HiRefresh,
  HiSave,
  HiShieldCheck,
  HiSparkles,
  HiUserGroup
} from "react-icons/hi";
import Card from "../components/common/Card";
import QuickStats from "../components/dashboard/QuickStats";
import Loading from "../components/common/Loading";
import { useAuth } from "../context/AuthContext";
import { authAPI, premierLeagueAPI } from "../services/api";

const formatKickoff = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "TBC";

const scoreLabel = (fixture) =>
  fixture.finished ? `${fixture.homeScore} - ${fixture.awayScore}` : "vs";

const ScoutDashboard = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [playerDetails, setPlayerDetails] = useState(null);
  const [refreshingTeam, setRefreshingTeam] = useState(false);

  useEffect(() => {
    const loadWorkspace = async () => {
      const response = await premierLeagueAPI.getScoutWorkspace();
      setWorkspace(response.data);
      setSelectedTeamId(response.data.selectedTeam?.id ? String(response.data.selectedTeam.id) : "");
      setSelectedPlayerId(response.data.selectedPlayer?.id ? String(response.data.selectedPlayer.id) : "");
      setPlayerDetails(
        response.data.selectedPlayer
          ? {
              player: response.data.selectedPlayer,
              ...response.data.selectedPlayerSummary
            }
          : null
      );
      setLoading(false);
    };

    loadWorkspace();
  }, []);

  const refreshTeamWorkspace = async (teamId, nextPlayerId = "") => {
    if (!teamId) {
      return;
    }

    setRefreshingTeam(true);
    try {
      const response = await premierLeagueAPI.getTeamWorkspace(teamId);
      const nextWorkspace = {
        ...workspace,
        selectedTeam: response.data.team,
        selectedTeamStats: response.data.stats,
        squad: response.data.squad,
        fixtures: response.data.fixtures
      };
      setWorkspace(nextWorkspace);

      const validPlayerId = nextPlayerId || (response.data.squad[0] ? String(response.data.squad[0].id) : "");
      setSelectedPlayerId(validPlayerId);

      if (validPlayerId) {
        const details = await premierLeagueAPI.getPlayerDetails(validPlayerId);
        setPlayerDetails(details.data);
      } else {
        setPlayerDetails(null);
      }
    } catch (error) {
      toast.error("Could not refresh that club workspace.");
    } finally {
      setRefreshingTeam(false);
    }
  };

  const handleTeamChange = async (event) => {
    const teamId = event.target.value;
    setSelectedTeamId(teamId);
    await refreshTeamWorkspace(teamId);
  };

  const handlePlayerChange = async (event) => {
    const playerId = event.target.value;
    setSelectedPlayerId(playerId);

    if (!playerId) {
      setPlayerDetails(null);
      return;
    }

    try {
      const response = await premierLeagueAPI.getPlayerDetails(playerId);
      setPlayerDetails(response.data);
    } catch (error) {
      toast.error("Could not load that player's details.");
    }
  };

  const handleSaveSelection = async () => {
    if (!selectedTeamId || !selectedPlayerId) {
      toast.error("Choose both a Premier League club and player first.");
      return;
    }

    setSaving(true);
    try {
      const response = await authAPI.updateScoutPreferences({
        selectedPremierLeagueTeamId: Number(selectedTeamId),
        selectedPremierLeaguePlayerId: Number(selectedPlayerId)
      });

      updateUser({
        selectedPremierLeagueTeamId: response.data.selectedPremierLeagueTeamId,
        selectedPremierLeaguePlayerId: response.data.selectedPremierLeaguePlayerId
      });
      toast.success("Scout preferences saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save scout preferences.");
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const teamStats = workspace?.selectedTeamStats || {};
    const squad = workspace?.squad || [];
    const selected = playerDetails?.player || workspace?.selectedPlayer || null;

    return [
      {
        icon: HiShieldCheck,
        label: "Club points",
        value: String(teamStats.points ?? 0),
        color: "primary",
        note: `${teamStats.wins ?? 0}W ${teamStats.draws ?? 0}D ${teamStats.losses ?? 0}L`
      },
      {
        icon: HiUserGroup,
        label: "Squad size",
        value: String(squad.length),
        color: "blue",
        note: "Live Premier League squad"
      },
      {
        icon: HiCalendar,
        label: "Fixtures loaded",
        value: String(workspace?.fixtures?.length || 0),
        color: "gold",
        note: "Finished and upcoming"
      },
      {
        icon: HiSparkles,
        label: "Selected player points",
        value: String(selected?.totalPoints ?? 0),
        color: "purple",
        note: selected ? `${selected.goals}G ${selected.assists}A` : "Choose a player"
      }
    ];
  }, [playerDetails, workspace]);

  if (loading) {
    return <Loading text="Loading Premier League scout workspace..." />;
  }

  const selectedTeam = workspace?.selectedTeam;
  const selectedPlayer = playerDetails?.player || workspace?.selectedPlayer;
  const squad = workspace?.squad || [];
  const fixtures = workspace?.fixtures || [];
  const recentMatches = playerDetails?.recentMatches || [];
  const upcomingPlayerFixtures = playerDetails?.upcomingFixtures || [];
  const previousSeasons = playerDetails?.previousSeasons || [];

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">
              Premier League <span className="gradient-text">Scout Workspace</span>
            </h1>
            <p className="mt-2 text-dark-400">
              Scout account: {user?.name}. Pick a club, lock a target player, then review fixtures, output, and match-by-match history.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => refreshTeamWorkspace(selectedTeamId, selectedPlayerId)} className="btn-secondary" disabled={!selectedTeamId || refreshingTeam}>
              <HiRefresh className={`h-4 w-4 ${refreshingTeam ? "animate-spin" : ""}`} />
              <span>Refresh Data</span>
            </button>
            <button onClick={handleSaveSelection} className="btn-primary" disabled={saving}>
              <HiSave className="h-4 w-4" />
              <span>{saving ? "Saving..." : "Save Selection"}</span>
            </button>
          </div>
        </div>

        <Card className="mb-8 p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
            <div>
              <label className="field-label">Premier League Club</label>
              <select value={selectedTeamId} onChange={handleTeamChange} className="input-field">
                <option value="">Choose a club</option>
                {(workspace?.teams || []).map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">Target Player</label>
              <select
                value={selectedPlayerId}
                onChange={handlePlayerChange}
                className="input-field"
                disabled={!selectedTeamId || refreshingTeam}
              >
                <option value="">{selectedTeamId ? "Choose a player" : "Choose a club first"}</option>
                {squad.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.displayName} · {player.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="rounded-2xl border border-primary-500/20 bg-primary-500/10 px-4 py-3 text-sm text-primary-200">
                {selectedTeam ? `${selectedTeam.name} · ${selectedPlayer?.displayName || "No player selected"}` : "Scout setup pending"}
              </div>
            </div>
          </div>
        </Card>

        <QuickStats stats={stats} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiChartBar className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Club snapshot</h2>
            </div>
            {selectedTeam ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <p className="text-sm text-dark-400">Selected club</p>
                  <p className="mt-2 text-2xl font-bold text-white">{selectedTeam.name}</p>
                  <p className="mt-1 text-sm text-dark-300">Strength rating {selectedTeam.strength}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Played", value: workspace?.selectedTeamStats?.played ?? 0 },
                    { label: "Points", value: workspace?.selectedTeamStats?.points ?? 0 },
                    { label: "Goals For", value: workspace?.selectedTeamStats?.goalsFor ?? 0 },
                    { label: "Goal Diff", value: workspace?.selectedTeamStats?.goalDifference ?? 0 }
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                      <p className="text-xs uppercase tracking-wider text-dark-400">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                  This club workspace is driven from live Fantasy Premier League team, player, and fixture data for the current Premier League season.
                </div>
              </div>
            ) : (
              <p className="text-sm text-dark-400">Choose a Premier League club to load the scout workspace.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiClipboardList className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Selected player profile</h2>
            </div>
            {selectedPlayer ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-white">{selectedPlayer.displayName}</p>
                      <p className="mt-1 text-sm text-dark-400">
                        {selectedPlayer.teamName} · {selectedPlayer.position}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                      {selectedPlayer.currentPrice.toFixed(1)}m
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { label: "Minutes", value: selectedPlayer.minutes },
                    { label: "Goals", value: selectedPlayer.goals },
                    { label: "Assists", value: selectedPlayer.assists },
                    { label: "Points", value: selectedPlayer.totalPoints },
                    { label: "xG", value: selectedPlayer.expectedGoals.toFixed(2) },
                    { label: "xA", value: selectedPlayer.expectedAssists.toFixed(2) },
                    { label: "ICT", value: selectedPlayer.ictIndex.toFixed(1) },
                    { label: "Starts", value: selectedPlayer.starts }
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                      <p className="text-xs uppercase tracking-wider text-dark-400">{item.label}</p>
                      <p className="mt-2 text-xl font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-dark-400">Scout note</p>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">
                    {selectedPlayer.displayName} has {selectedPlayer.goals} goals, {selectedPlayer.assists} assists, {selectedPlayer.minutes} minutes, and an ICT Index of {selectedPlayer.ictIndex.toFixed(1)} this season.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-dark-400">Choose a player to inspect detailed statistics.</p>
            )}
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiUserGroup className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Squad ranking</h2>
            </div>
            <div className="space-y-3">
              {squad.slice(0, 12).map((player) => (
                <button
                  key={player.id}
                  onClick={() => handlePlayerChange({ target: { value: String(player.id) } })}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${
                    String(player.id) === selectedPlayerId
                      ? "border-primary-500/30 bg-primary-500/10"
                      : "border-white/5 bg-dark-900/50 hover:border-white/10"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white">{player.displayName}</p>
                    <p className="mt-1 text-xs text-dark-400">
                      {player.position} · {player.minutes} mins · {player.pointsPerGame} PPG
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{player.totalPoints}</p>
                    <p className="text-xs text-dark-500">{player.goals}G / {player.assists}A</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiCalendar className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Club fixtures</h2>
            </div>
            <div className="space-y-3">
              {fixtures.slice(0, 8).map((fixture) => (
                <div key={fixture.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">
                      {fixture.homeTeam} {scoreLabel(fixture)} {fixture.awayTeam}
                    </p>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-dark-300">
                      GW {fixture.event}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-dark-400">{formatKickoff(fixture.kickoffTime)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiSparkles className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Recent match log</h2>
            </div>
            {recentMatches.length ? (
              <div className="space-y-3">
                {recentMatches.slice(0, 6).map((match) => (
                  <div key={`${match.fixture}-${match.round}`} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">GW {match.round}</p>
                      <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">
                        {match.total_points} pts
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-dark-400">{formatKickoff(match.kickoff_time)}</p>
                    <p className="mt-2 text-sm text-dark-300">
                      {match.minutes} mins · {match.goals_scored} goals · {match.assists} assists · xGI {Number(match.expected_goal_involvements).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">No recent match history loaded yet.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiChartBar className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Forward view</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                <p className="text-xs uppercase tracking-wider text-dark-400">Upcoming player fixtures</p>
                <div className="mt-3 space-y-2">
                  {upcomingPlayerFixtures.slice(0, 4).map((fixture) => (
                    <div key={fixture.id} className="text-sm text-dark-300">
                      {fixture.is_home ? selectedPlayer?.teamName : "Away"} fixture on {formatKickoff(fixture.kickoff_time)} · difficulty {fixture.difficulty}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                <p className="text-xs uppercase tracking-wider text-dark-400">Previous seasons</p>
                <div className="mt-3 space-y-2">
                  {previousSeasons.slice(0, 3).map((season) => (
                    <div key={season.season_name} className="text-sm text-dark-300">
                      {season.season_name}: {season.minutes} mins, {season.goals_scored} goals, {season.assists} assists, {season.total_points} points
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScoutDashboard;
