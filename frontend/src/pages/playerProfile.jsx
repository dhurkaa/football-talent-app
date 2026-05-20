import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";

function PlayerProfile() {
  const { id } = useParams();

  const [player, setPlayer] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [playerRes, reportsRes] = await Promise.all([
        api.get(`/players/${id}`),
        api.get("/scout-reports"),
      ]);

      setPlayer(playerRes.data);

      const playerReports = reportsRes.data.filter((report) => {
        const reportPlayerId = report.playerId?._id || report.playerId;
        return reportPlayerId === id;
      });

      setReports(playerReports);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load player profile");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const averageRating = useMemo(() => {
    if (!reports.length) return 0;

    const total = reports.reduce((sum, report) => {
      return sum + Number(report.rating || 0);
    }, 0);

    return (total / reports.length).toFixed(1);
  }, [reports]);

  if (loading) {
    return <div className="loading-card">Loading player profile...</div>;
  }

  if (error) {
    return <div className="error-box">{error}</div>;
  }

  if (!player) {
    return <div className="error-box">Player not found.</div>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-label">Player Profile</span>
          <h1>{player.fullName}</h1>
          <p>
            Detailed view of player information, team connection, statistics and
            scouting reports.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="panel profile-main-card">
          <div className="profile-avatar">
            {player.fullName
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </div>

          <h2>{player.fullName}</h2>
          <p>{player.position}</p>

          <div className="profile-meta">
            <div>
              <span>Team</span>
              <strong>{player.teamId?.name || "No team"}</strong>
            </div>

            <div>
              <span>Nationality</span>
              <strong>{player.nationality}</strong>
            </div>

            <div>
              <span>Age</span>
              <strong>{player.age}</strong>
            </div>

            <div>
              <span>Preferred Foot</span>
              <strong>{player.preferredFoot}</strong>
            </div>

            <div>
              <span>Height</span>
              <strong>{player.height} cm</strong>
            </div>

            <div>
              <span>Market Value</span>
              <strong>€{Number(player.marketValue || 0).toLocaleString()}</strong>
            </div>
          </div>

          <Link to="/players" className="back-link">
            Back to Players
          </Link>
        </div>

        <div className="panel">
          <h2>Performance Stats</h2>

          <div className="stats-detail-grid">
            <div className="detail-stat">
              <span>Goals</span>
              <strong>{player.stats?.goals || 0}</strong>
            </div>

            <div className="detail-stat">
              <span>Assists</span>
              <strong>{player.stats?.assists || 0}</strong>
            </div>

            <div className="detail-stat">
              <span>Matches</span>
              <strong>{player.stats?.matchesPlayed || 0}</strong>
            </div>

            <div className="detail-stat">
              <span>Yellow Cards</span>
              <strong>{player.stats?.yellowCards || 0}</strong>
            </div>

            <div className="detail-stat">
              <span>Red Cards</span>
              <strong>{player.stats?.redCards || 0}</strong>
            </div>

            <div className="detail-stat">
              <span>Avg. Scout Rating</span>
              <strong>{averageRating}/10</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="panel full-panel">
        <div className="panel-title-row">
          <div>
            <h2>Scouting Reports</h2>
            <p>Reports connected to this player.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Scout</th>
                <th>Rating</th>
                <th>Strengths</th>
                <th>Weaknesses</th>
                <th>Recommendation</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td>{report.scoutId?.fullName || "Unknown scout"}</td>
                  <td>{report.rating}/10</td>
                  <td>
                    {Array.isArray(report.strengths)
                      ? report.strengths.join(", ")
                      : "-"}
                  </td>
                  <td>
                    {Array.isArray(report.weaknesses)
                      ? report.weaknesses.join(", ")
                      : "-"}
                  </td>
                  <td>{report.recommendation}</td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No scouting reports for this player.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PlayerProfile;
