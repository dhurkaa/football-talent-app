import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

function Analytics() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [reports, setReports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [playersRes, matchesRes, reportsRes, teamsRes] = await Promise.all([
        api.get("/players"),
        api.get("/matches"),
        api.get("/scout-reports"),
        api.get("/teams"),
      ]);

      setPlayers(playersRes.data);
      setMatches(matchesRes.data);
      setReports(reportsRes.data);
      setTeams(teamsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const topScorers = useMemo(() => {
    return [...players]
      .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
      .slice(0, 5);
  }, [players]);

  const topRatedPlayers = useMemo(() => {
    const map = {};

    reports.forEach((report) => {
      const playerId = report.playerId?._id || report.playerId;

      if (!playerId) return;

      if (!map[playerId]) {
        map[playerId] = {
          player: report.playerId,
          total: 0,
          count: 0,
        };
      }

      map[playerId].total += Number(report.rating || 0);
      map[playerId].count += 1;
    });

    return Object.values(map)
      .map((item) => ({
        player: item.player,
        average: item.count ? item.total / item.count : 0,
        count: item.count,
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);
  }, [reports]);

  const playersByPosition = useMemo(() => {
    const positions = {
      Goalkeeper: 0,
      Defender: 0,
      Midfielder: 0,
      Forward: 0,
    };

    players.forEach((player) => {
      if (positions[player.position] !== undefined) {
        positions[player.position] += 1;
      }
    });

    return positions;
  }, [players]);

  const totalGoals = useMemo(() => {
    return players.reduce((sum, player) => {
      return sum + Number(player.stats?.goals || 0);
    }, 0);
  }, [players]);

  const totalMarketValue = useMemo(() => {
    return players.reduce((sum, player) => {
      return sum + Number(player.marketValue || 0);
    }, 0);
  }, [players]);

  const playedMatches = matches.filter((match) => match.status === "played").length;

  const maxPositionCount = Math.max(...Object.values(playersByPosition), 1);

  if (loading) {
    return <div className="loading-card">Loading analytics...</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-label">Analytics</span>
          <h1>Football Analytics</h1>
          <p>
            Analytical overview based on players, matches and scouting reports.
            This page shows how stored data can be used for decision-making.
          </p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Goals</span>
          <strong>{totalGoals}</strong>
        </div>

        <div className="stat-card">
          <span>Total Market Value</span>
          <strong>€{totalMarketValue.toLocaleString()}</strong>
        </div>

        <div className="stat-card">
          <span>Played Matches</span>
          <strong>{playedMatches}</strong>
        </div>

        <div className="stat-card">
          <span>Total Teams</span>
          <strong>{teams.length}</strong>
        </div>

        <div className="stat-card">
          <span>Total Reports</span>
          <strong>{reports.length}</strong>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="panel">
          <h2>Top Scorers</h2>

          <div className="ranking-list">
            {topScorers.map((player, index) => (
              <div className="ranking-item" key={player._id}>
                <div>
                  <span>#{index + 1}</span>
                  <strong>{player.fullName}</strong>
                  <small>{player.teamId?.name || "Unknown team"}</small>
                </div>

                <b>{player.stats?.goals || 0} goals</b>
              </div>
            ))}

            {topScorers.length === 0 && (
              <p className="muted-text">No players available.</p>
            )}
          </div>
        </div>

        <div className="panel">
          <h2>Top Rated by Scouts</h2>

          <div className="ranking-list">
            {topRatedPlayers.map((item, index) => (
              <div className="ranking-item" key={item.player?._id || index}>
                <div>
                  <span>#{index + 1}</span>
                  <strong>{item.player?.fullName || "Unknown player"}</strong>
                  <small>{item.count} report(s)</small>
                </div>

                <b>{item.average.toFixed(1)}/10</b>
              </div>
            ))}

            {topRatedPlayers.length === 0 && (
              <p className="muted-text">No scout reports available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="panel full-panel">
        <div className="panel-title-row">
          <div>
            <h2>Players by Position</h2>
            <p>Simple visual distribution of players based on their field role.</p>
          </div>
        </div>

        <div className="bar-list">
          {Object.entries(playersByPosition).map(([position, count]) => (
            <div className="bar-row" key={position}>
              <div className="bar-label">
                <strong>{position}</strong>
                <span>{count}</span>
              </div>

              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(count / maxPositionCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-grid bottom-gap">
        <div className="info-card">
          <h3>Why Analytics?</h3>
          <p>
            Analytics helps clubs compare players using goals, ratings, market
            value and scouting information instead of relying only on basic
            records.
          </p>
        </div>

        <div className="info-card">
          <h3>Decision Support</h3>
          <p>
            The system can support decisions about which players deserve more
            attention, which players are recommended by scouts, and which teams
            have stronger talent.
          </p>
        </div>

        <div className="info-card">
          <h3>Project Value</h3>
          <p>
            This page shows that the application is not only CRUD-based, but also
            uses the stored data for meaningful analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;