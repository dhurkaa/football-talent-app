import { useEffect, useState } from "react";
import api from "../api/api";

const emptyForm = {
  homeTeamId: "",
  awayTeamId: "",
  matchDate: "",
  stadium: "",
  scoreHome: "",
  scoreAway: "",
  status: "scheduled",
};

function Matches() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [matchesRes, teamsRes] = await Promise.all([
        api.get("/matches"),
        api.get("/teams"),
      ]);

      setMatches(matchesRes.data);
      setTeams(teamsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load matches");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const buildPayload = () => ({
    homeTeamId: form.homeTeamId,
    awayTeamId: form.awayTeamId,
    matchDate: form.matchDate,
    stadium: form.stadium,
    scoreHome: Number(form.scoreHome || 0),
    scoreAway: Number(form.scoreAway || 0),
    status: form.status,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.homeTeamId === form.awayTeamId) {
      setError("Home team and away team cannot be the same.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/matches/${editingId}`, buildPayload());
        setMessage("Match updated successfully.");
      } else {
        await api.post("/matches", buildPayload());
        setMessage("Match created successfully.");
      }

      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (match) => {
    setEditingId(match._id);

    setForm({
      homeTeamId: match.homeTeamId?._id || match.homeTeamId || "",
      awayTeamId: match.awayTeamId?._id || match.awayTeamId || "",
      matchDate: match.matchDate ? match.matchDate.slice(0, 10) : "",
      stadium: match.stadium || "",
      scoreHome: match.scoreHome ?? "",
      scoreAway: match.scoreAway ?? "",
      status: match.status || "scheduled",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this match?")) return;

    try {
      await api.delete(`/matches/${id}`);
      setMessage("Match deleted successfully.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-label">CRUD + References</span>
          <h1>Matches</h1>
          <p>
            Manage football matches by connecting home and away teams through
            MongoDB ObjectId references.
          </p>
        </div>
      </div>

      {message && <div className="success-box">{message}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="crud-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Match" : "Add Match"}</h2>

          <select
            name="homeTeamId"
            value={form.homeTeamId}
            onChange={handleChange}
            required
          >
            <option value="">Select home team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <select
            name="awayTeamId"
            value={form.awayTeamId}
            onChange={handleChange}
            required
          >
            <option value="">Select away team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <input
            name="matchDate"
            type="date"
            value={form.matchDate}
            onChange={handleChange}
            required
          />

          <input
            name="stadium"
            placeholder="Stadium"
            value={form.stadium}
            onChange={handleChange}
            required
          />

          <div className="mini-grid">
            <input
              name="scoreHome"
              type="number"
              placeholder="Home score"
              value={form.scoreHome}
              onChange={handleChange}
            />

            <input
              name="scoreAway"
              type="number"
              placeholder="Away score"
              value={form.scoreAway}
              onChange={handleChange}
            />
          </div>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="scheduled">Scheduled</option>
            <option value="played">Played</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Match" : "Create Match"}
            </button>

            {editingId && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="panel table-panel">
          <h2>Match List</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Home</th>
                  <th>Away</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Stadium</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {matches.map((match) => (
                  <tr key={match._id}>
                    <td>{formatDate(match.matchDate)}</td>
                    <td>{match.homeTeamId?.name || "Unknown"}</td>
                    <td>{match.awayTeamId?.name || "Unknown"}</td>
                    <td>
                      {match.scoreHome} - {match.scoreAway}
                    </td>
                    <td>
                      <span className={`status-pill ${match.status}`}>
                        {match.status}
                      </span>
                    </td>
                    <td>{match.stadium}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(match)}>Edit</button>
                      <button
                        className="danger-btn"
                        onClick={() => handleDelete(match._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {matches.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-cell">
                      No matches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Matches;