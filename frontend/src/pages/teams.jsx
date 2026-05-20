import { useEffect, useState } from "react";
import api from "../api/api";

const emptyForm = {
  name: "",
  city: "",
  foundedYear: "",
  coachName: "",
  stadium: "",
  leagueName: "",
};

function Teams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadTeams = async () => {
    const res = await api.get("/teams");
    setTeams(res.data);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      foundedYear: Number(form.foundedYear),
    };

    if (editingId) {
      await api.put(`/teams/${editingId}`, payload);
      setMessage("Team updated successfully.");
    } else {
      await api.post("/teams", payload);
      setMessage("Team created successfully.");
    }

    resetForm();
    loadTeams();
  };

  const handleEdit = (team) => {
    setEditingId(team._id);
    setForm({
      name: team.name || "",
      city: team.city || "",
      foundedYear: team.foundedYear || "",
      coachName: team.coachName || "",
      stadium: team.stadium || "",
      leagueName: team.leagueName || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this team?")) return;

    await api.delete(`/teams/${id}`);
    loadTeams();
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-label">CRUD</span>
          <h1>Teams</h1>
          <p>Create, read, update and delete football teams.</p>
        </div>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="crud-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Team" : "Add Team"}</h2>

          <input name="name" placeholder="Team name" value={form.name} onChange={handleChange} required />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          <input name="foundedYear" type="number" placeholder="Founded year" value={form.foundedYear} onChange={handleChange} required />
          <input name="coachName" placeholder="Coach name" value={form.coachName} onChange={handleChange} required />
          <input name="stadium" placeholder="Stadium" value={form.stadium} onChange={handleChange} required />
          <input name="leagueName" placeholder="League name" value={form.leagueName} onChange={handleChange} required />

          <div className="form-actions">
            <button type="submit">{editingId ? "Update Team" : "Create Team"}</button>
            {editingId && <button type="button" className="secondary-btn" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <div className="panel table-panel">
          <h2>Team List</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Coach</th>
                  <th>League</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {teams.map((team) => (
                  <tr key={team._id}>
                    <td>{team.name}</td>
                    <td>{team.city}</td>
                    <td>{team.coachName}</td>
                    <td>{team.leagueName}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(team)}>Edit</button>
                      <button className="danger-btn" onClick={() => handleDelete(team._id)}>Delete</button>
                    </td>
                  </tr>
                ))}

                {teams.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-cell">No teams found.</td>
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

export default Teams;