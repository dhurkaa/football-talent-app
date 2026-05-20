import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

const emptyForm = {
  fullName: "",
  age: "",
  position: "Forward",
  nationality: "",
  height: "",
  preferredFoot: "Right",
  teamId: "",
  marketValue: "",
  goals: "",
  assists: "",
  matchesPlayed: "",
  yellowCards: "",
  redCards: "",
};

function Players() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [playersRes, teamsRes] = await Promise.all([
      api.get("/players"),
      api.get("/teams"),
    ]);

    setPlayers(playersRes.data);
    setTeams(teamsRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const buildPayload = () => ({
    fullName: form.fullName,
    age: Number(form.age),
    position: form.position,
    nationality: form.nationality,
    height: Number(form.height),
    preferredFoot: form.preferredFoot,
    teamId: form.teamId,
    marketValue: Number(form.marketValue),
    stats: {
      goals: Number(form.goals || 0),
      assists: Number(form.assists || 0),
      matchesPlayed: Number(form.matchesPlayed || 0),
      yellowCards: Number(form.yellowCards || 0),
      redCards: Number(form.redCards || 0),
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (editingId) {
      await api.put(`/players/${editingId}`, buildPayload());
      setMessage("Player updated successfully.");
    } else {
      await api.post("/players", buildPayload());
      setMessage("Player created successfully.");
    }

    resetForm();
    loadData();
  };

  const handleEdit = (player) => {
    setEditingId(player._id);

    setForm({
      fullName: player.fullName || "",
      age: player.age || "",
      position: player.position || "Forward",
      nationality: player.nationality || "",
      height: player.height || "",
      preferredFoot: player.preferredFoot || "Right",
      teamId: player.teamId?._id || player.teamId || "",
      marketValue: player.marketValue || "",
      goals: player.stats?.goals || "",
      assists: player.stats?.assists || "",
      matchesPlayed: player.stats?.matchesPlayed || "",
      yellowCards: player.stats?.yellowCards || "",
      redCards: player.stats?.redCards || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this player?")) return;

    await api.delete(`/players/${id}`);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-label">CRUD + References</span>
          <h1>Players</h1>
          <p>Manage players and connect them with teams using ObjectId references.</p>
        </div>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="crud-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Player" : "Add Player"}</h2>

          <input name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} required />
          <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />

          <select name="position" value={form.position} onChange={handleChange}>
            <option>Goalkeeper</option>
            <option>Defender</option>
            <option>Midfielder</option>
            <option>Forward</option>
          </select>

          <input name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} required />
          <input name="height" type="number" placeholder="Height cm" value={form.height} onChange={handleChange} required />

          <select name="preferredFoot" value={form.preferredFoot} onChange={handleChange}>
            <option>Left</option>
            <option>Right</option>
            <option>Both</option>
          </select>

          <select name="teamId" value={form.teamId} onChange={handleChange} required>
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <input name="marketValue" type="number" placeholder="Market value" value={form.marketValue} onChange={handleChange} required />

          <div className="mini-grid">
            <input name="goals" type="number" placeholder="Goals" value={form.goals} onChange={handleChange} />
            <input name="assists" type="number" placeholder="Assists" value={form.assists} onChange={handleChange} />
            <input name="matchesPlayed" type="number" placeholder="Matches" value={form.matchesPlayed} onChange={handleChange} />
            <input name="yellowCards" type="number" placeholder="Yellow" value={form.yellowCards} onChange={handleChange} />
            <input name="redCards" type="number" placeholder="Red" value={form.redCards} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="submit">{editingId ? "Update Player" : "Create Player"}</button>
            {editingId && <button type="button" className="secondary-btn" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <div className="panel table-panel">
          <h2>Player List</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Position</th>
                  <th>Goals</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {players.map((player) => (
                  <tr key={player._id}>
                    <td>{player.fullName}</td>
                    <td>{player.teamId?.name || "No team"}</td>
                    <td>{player.position}</td>
                    <td>{player.stats?.goals || 0}</td>
                    <td>€{Number(player.marketValue).toLocaleString()}</td>
                    <td className="actions">
  <Link className="small-link-btn" to={`/players/${player._id}`}>
    View
  </Link>
  <button onClick={() => handleEdit(player)}>Edit</button>
  <button className="danger-btn" onClick={() => handleDelete(player._id)}>
    Delete
  </button>
</td>
                  </tr>
                ))}

                {players.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-cell">No players found.</td>
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

export default Players;