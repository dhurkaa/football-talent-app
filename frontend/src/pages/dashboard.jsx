import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { Users, Trophy, Shield, ClipboardList, Search, TrendingUp } from "lucide-react";

function Dashboard() {
  const [data, setData] = useState({
    teams: [],
    players: [],
    matches: [],
    scouts: [],
    reports: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      const [teams, players, matches, scouts, reports] = await Promise.all([
        api.get("/teams"),
        api.get("/players"),
        api.get("/matches"),
        api.get("/scouts"),
        api.get("/scout-reports"),
      ]);

      setData({
        teams: teams.data,
        players: players.data,
        matches: matches.data,
        scouts: scouts.data,
        reports: reports.data,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const bestPlayer = useMemo(() => {
    if (!data.players.length) return null;

    return [...data.players].sort((a, b) => {
      const goalsA = a.stats?.goals || 0;
      const goalsB = b.stats?.goals || 0;
      return goalsB - goalsA;
    })[0];
  }, [data.players]);

  const averageRating = useMemo(() => {
    if (!data.reports.length) return 0;

    const total = data.reports.reduce((sum, report) => {
      return sum + Number(report.rating || 0);
    }, 0);

    return (total / data.reports.length).toFixed(1);
  }, [data.reports]);

  const playedMatches = data.matches.filter((match) => match.status === "played").length;

  return (
    <div className="page">
      <div className="page-header hero-header">
        <div>
          <span className="section-label">Dashboard</span>
          <h1>Football Talent & Match Analytics</h1>
          <p>
            A MERN application for managing teams, players, matches, scouts and
            scouting reports. The system uses React for the frontend, Express for
            the API, and MongoDB Atlas for the database.
          </p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="loading-card">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <Trophy />
              <span>Teams</span>
              <strong>{data.teams.length}</strong>
            </div>

            <div className="stat-card">
              <Users />
              <span>Players</span>
              <strong>{data.players.length}</strong>
            </div>

            <div className="stat-card">
              <Shield />
              <span>Matches</span>
              <strong>{data.matches.length}</strong>
            </div>

            <div className="stat-card">
              <Search />
              <span>Scouts</span>
              <strong>{data.scouts.length}</strong>
            </div>

            <div className="stat-card">
              <ClipboardList />
              <span>Reports</span>
              <strong>{data.reports.length}</strong>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>Top Player</h3>
              {bestPlayer ? (
                <p>
                  <strong>{bestPlayer.fullName}</strong> has{" "}
                  <strong>{bestPlayer.stats?.goals || 0}</strong> goals and plays
                  for <strong>{bestPlayer.teamId?.name || "Unknown team"}</strong>.
                </p>
              ) : (
                <p>No players registered yet.</p>
              )}
            </div>

            <div className="info-card">
              <h3>Scouting Average</h3>
              <p>
                Average scouting rating is <strong>{averageRating}/10</strong>{" "}
                based on all submitted scout reports.
              </p>
            </div>

            <div className="info-card">
              <h3>Played Matches</h3>
              <p>
                <strong>{playedMatches}</strong> out of{" "}
                <strong>{data.matches.length}</strong> matches are marked as
                played.
              </p>
            </div>
          </div>

          <div className="info-grid bottom-gap">
            <div className="info-card">
              <h3>Database to Backend</h3>
              <p>
                The backend connects to MongoDB Atlas using Mongoose. Each model
                represents a collection, such as Team, Player, Match, Scout and
                ScoutReport.
              </p>
            </div>

            <div className="info-card">
              <h3>Backend to Frontend</h3>
              <p>
                React communicates with Express routes using Axios. The frontend
                sends HTTP requests such as GET, POST, PUT and DELETE to the
                backend API.
              </p>
            </div>

            <div className="info-card">
              <h3>Authentication</h3>
              <p>
                After login, the backend returns a JWT token. The frontend stores
                it in localStorage and sends it in the Authorization header for
                protected routes.
              </p>
            </div>
          </div>

          <div className="panel full-panel">
            <div className="panel-title-row">
              <div>
                <h2>Recent Players</h2>
                <p>Latest registered football talents in the system.</p>
              </div>
              <TrendingUp size={22} />
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Team</th>
                    <th>Position</th>
                    <th>Goals</th>
                    <th>Market Value</th>
                  </tr>
                </thead>

                <tbody>
                  {data.players.slice(0, 5).map((player) => (
                    <tr key={player._id}>
                      <td>{player.fullName}</td>
                      <td>{player.teamId?.name || "Unknown"}</td>
                      <td>{player.position}</td>
                      <td>{player.stats?.goals || 0}</td>
                      <td>€{Number(player.marketValue || 0).toLocaleString()}</td>
                    </tr>
                  ))}

                  {data.players.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-cell">
                        No players found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;