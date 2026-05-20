import { useEffect, useState } from "react";
import api from "../api/api";

const emptyForm = {
  fullName: "",
  experienceYears: "",
  region: "",
  email: "",
};

function Scouts() {
  const [scouts, setScouts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadScouts = async () => {
    try {
      const res = await api.get("/scouts");
      setScouts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load scouts");
    }
  };

  useEffect(() => {
    loadScouts();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      fullName: form.fullName,
      experienceYears: Number(form.experienceYears),
      region: form.region,
      email: form.email,
    };

    try {
      if (editingId) {
        await api.put(`/scouts/${editingId}`, payload);
        setMessage("Scout updated successfully.");
      } else {
        await api.post("/scouts", payload);
        setMessage("Scout created successfully.");
      }

      resetForm();
      loadScouts();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  const handleEdit = (scout) => {
    setEditingId(scout._id);
    setForm({
      fullName: scout.fullName || "",
      experienceYears: scout.experienceYears || "",
      region: scout.region || "",
      email: scout.email || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this scout?")) return;

    try {
      await api.delete(`/scouts/${id}`);
      setMessage("Scout deleted successfully.");
      loadScouts();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="section-label">CRUD</span>
          <h1>Scouts</h1>
          <p>
            Manage scout profiles. Each scout can later be connected with
            scouting reports.
          </p>
        </div>
      </div>

      {message && <div className="success-box">{message}</div>}
      {error && <div className="error-box">{error}</div>}

      <div className="crud-grid">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Scout" : "Add Scout"}</h2>

          <input
            name="fullName"
            placeholder="Scout full name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            name="experienceYears"
            type="number"
            placeholder="Experience years"
            value={form.experienceYears}
            onChange={handleChange}
            required
          />

          <input
            name="region"
            placeholder="Region"
            value={form.region}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button type="submit">
              {editingId ? "Update Scout" : "Create Scout"}
            </button>

            {editingId && (
              <button type="button" className="secondary-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="panel table-panel">
          <h2>Scout List</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Experience</th>
                  <th>Region</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {scouts.map((scout) => (
                  <tr key={scout._id}>
                    <td>{scout.fullName}</td>
                    <td>{scout.experienceYears} years</td>
                    <td>{scout.region}</td>
                    <td>{scout.email}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(scout)}>Edit</button>
                      <button
                        className="danger-btn"
                        onClick={() => handleDelete(scout._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {scouts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      No scouts found.
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

export default Scouts;