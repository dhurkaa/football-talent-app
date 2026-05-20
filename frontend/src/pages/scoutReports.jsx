import { useEffect, useState } from "react";
import api from "../api/api";

const emptyForm = {
  playerId: "",
  scoutId: "",
  rating: "",
  strengths: "",
  weaknesses: "",
  recommendation: "",
};

function ScoutReports() {
  const [reports, setReports] = useState([]);
  const [players, setPlayers] = useState([]);
  const [scouts, setScouts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [reportsRes, playersRes, scoutsRes] = await Promise.all([
        api.get("/scout-reports"),
        api.get("/players"),
        api.get("/scouts"),
      ]);

      setReports(reportsRes.data);
      setPlayers(playersRes.data);
      setScouts(scoutsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load scout reports");
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

  const toArray = (value) => {
    if (!value) return [];

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const buildPayload = () => ({
    playerId: form.playerId,
    scoutId: form.scoutId,
    rating: Number(form.rating),
    strengths: toArray(form.strengths),
    weaknesses: toArray(form.weaknesses),
    recommendation: form.recommendation,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await api.put(`/scout-reports/${editingId}`, buildPayload());
        setMessage("Scout report updated successfully.");
      } else {
        await api.post("/scout-reports", buildPayload());
        setMessage("Scout report created successfully.");
      }

      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (report) => {
    setEditingId(report._id);

    setForm({
      playerId: report.playerId?._id || report.playerId || "",
      scoutId: report.scoutId?._id || report.scoutId || "",
      rating: report.rating || "",
      strengths: Array.isArray(report.strengths)
        ? report.strengths.join(", ")
        : "",
      weaknesses: Array.isArray(report.weaknesses)
        ? report.weaknesses.join(", ")
        : "",
      recommendation: report.recommendation || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this scout report?")) return;

    try {
      await api.delete(`/scout-reports/${id}`);
      setMessage("Scout report deleted successfully.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-label">CRUD + References</span>
          <h1>Scout Reports</h1>
          <p>
            Create reports that connect players with scouts using MongoDB
            ObjectId references.
          </p>
        </div>
      </div>

      {message && <div className="success-box">{message}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="crud-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Report" : "Add Report"}</h2>

          <select
            name="playerId"
            value={form.playerId}
            onChange={handleChange}
            required
          >
            <option value="">Select player</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.fullName} - {player.position}
              </option>
            ))}
          </select>

          <select
            name="scoutId"
            value={form.scoutId}
            onChange={handleChange}
            required
          >
            <option value="">Select scout</option>
            {scouts.map((scout) => (
              <option key={scout._id} value={scout._id}>
                {scout.fullName} - {scout.region}
              </option>
            ))}
          </select>

          <input
            name="rating"
            type="number"
            min="1"
            max="10"
            placeholder="Rating 1-10"
            value={form.rating}
            onChange={handleChange}
            required
          />

          <input
            name="strengths"
            placeholder="Strengths, separated by comma"
            value={form.strengths}
            onChange={handleChange}
          />

          <input
            name="weaknesses"
            placeholder="Weaknesses, separated by comma"
            value={form.weaknesses}
            onChange={handleChange}
          />

          <textarea
            name="recommendation"
            placeholder="Recommendation"
            value={form.recommendation}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Report" : "Create Report"}
            </button>

            {editingId && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="panel table-panel">
          <h2>Report List</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Scout</th>
                  <th>Rating</th>
                  <th>Strengths</th>
                  <th>Recommendation</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((report) => (
                  <tr key={report._id}>
                    <td>{report.playerId?.fullName || "Unknown player"}</td>
                    <td>{report.scoutId?.fullName || "Unknown scout"}</td>
                    <td>{report.rating}/10</td>
                    <td>
                      {Array.isArray(report.strengths)
                        ? report.strengths.join(", ")
                        : "-"}
                    </td>
                    <td>{report.recommendation}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(report)}>Edit</button>
                      <button
                        className="danger-btn"
                        onClick={() => handleDelete(report._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {reports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      No scout reports found.
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

export default ScoutReports;