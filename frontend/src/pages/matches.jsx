import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { HiClock, HiLocationMarker, HiPencil, HiPlay, HiPlus, HiTrash, HiUserGroup } from "react-icons/hi";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import Modal from "../components/common/Modal";
import api from "../api/api";
import { matchAPI, teamAPI } from "../services/api";

const emptyForm = {
  homeTeamId: "",
  awayTeamId: "",
  matchDate: "",
  stadium: "",
  scoreHome: "",
  scoreAway: "",
  status: "scheduled"
};

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [matchesResponse, teamsResponse] = await Promise.all([matchAPI.getAll(), teamAPI.getAll()]);
    setMatches(matchesResponse.data);
    setTeams(teamsResponse.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summary = useMemo(() => {
    const scheduledCount = matches.filter((match) => String(match.status).toLowerCase().includes("upcoming") || match.status === "scheduled").length;
    const liveCount = matches.filter((match) => String(match.status).toLowerCase() === "live").length;
    const totalScouts = matches.reduce((sum, match) => sum + (match.scouts || 0), 0);
    return {
      scheduledCount,
      liveCount,
      totalScouts,
      featuredProspects: matches.reduce((sum, match) => sum + ((match.featuredProspects || []).length || 0), 0)
    };
  }, [matches]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const openCreateModal = () => {
    setEditingMatch(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (match) => {
    setEditingMatch(match);
    const homeTeam = teams.find((team) => team.name === match.home);
    const awayTeam = teams.find((team) => team.name === match.away);
    setFormData({
      homeTeamId: homeTeam?.id || "",
      awayTeamId: awayTeam?.id || "",
      matchDate: match.date ? new Date(match.date).toISOString().slice(0, 16) : "",
      stadium: match.venue || "",
      scoreHome: match.scoreHome ?? "",
      scoreAway: match.scoreAway ?? "",
      status: ["scheduled", "played", "cancelled"].includes(match.status) ? match.status : "scheduled"
    });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.homeTeamId === formData.awayTeamId) {
      toast.error("Home and away team cannot be the same.");
      return;
    }

    setSaving(true);
    const payload = {
      homeTeamId: formData.homeTeamId,
      awayTeamId: formData.awayTeamId,
      matchDate: formData.matchDate,
      stadium: formData.stadium,
      scoreHome: Number(formData.scoreHome || 0),
      scoreAway: Number(formData.scoreAway || 0),
      status: formData.status
    };

    try {
      if (editingMatch) {
        await api.put(`/matches/${editingMatch.id}`, payload);
        toast.success("Match updated successfully.");
      } else {
        await matchAPI.create(payload);
        toast.success("Match created successfully.");
      }

      setModalOpen(false);
      setEditingMatch(null);
      setFormData(emptyForm);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save match.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (match) => {
    if (!window.confirm(`Delete ${match.home} vs ${match.away}?`)) return;

    try {
      await api.delete(`/matches/${match.id}`);
      toast.success("Match deleted successfully.");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete match.");
    }
  };

  if (loading) {
    return <Loading text="Loading matches..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">
              Match <span className="gradient-text">Center</span>
            </h1>
            <p className="mt-2 text-dark-400">
              Ketu i ke fixture cards edhe CRUD per matches, pa shtuar faqe te reja.
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <HiPlus className="h-4 w-4" />
            <span>Add Match</span>
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: "Upcoming fixtures", value: summary.scheduledCount, icon: HiClock },
            { label: "Live right now", value: summary.liveCount, icon: HiPlay },
            { label: "Scouts assigned", value: summary.totalScouts, icon: HiUserGroup },
            { label: "Featured prospects", value: summary.featuredProspects, icon: HiUserGroup }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {matches.map((match) => (
            <Card key={match.id} className="p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                      {match.status}
                    </span>
                    {match.competition ? (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-dark-300">{match.competition}</span>
                    ) : null}
                    <span className="text-sm text-dark-400">{new Date(match.date).toLocaleDateString()}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-white">
                    {match.home} <span className="text-dark-500">vs</span> {match.away}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-dark-400">
                    <span className="inline-flex items-center gap-2">
                      <HiLocationMarker className="h-4 w-4 text-primary-400" />
                      <span>{match.venue}</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <HiUserGroup className="h-4 w-4 text-primary-400" />
                      <span>{match.scouts} scouts attending</span>
                    </span>
                  </div>
                  {match.storyline ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-dark-300">{match.storyline}</p> : null}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl border border-white/5 bg-dark-900/50 px-5 py-4 text-center">
                    <p className="text-xs uppercase tracking-wider text-dark-400">Kickoff</p>
                    <p className="mt-2 text-lg font-bold text-white">
                      {new Date(match.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {match.broadcast ? <p className="mt-2 text-xs text-dark-500">{match.broadcast}</p> : null}
                  </div>
                  <Button variant="secondary" className="text-sm" onClick={() => openEditModal(match)}>
                    <HiPencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button variant="secondary" className="text-sm border-red-500/20 text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(match)}>
                    <HiTrash className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingMatch ? "Edit Match" : "Add Match"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="homeTeamId" value={formData.homeTeamId} onChange={handleChange} className="input-field" required>
                <option value="">Select home team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <select name="awayTeamId" value={formData.awayTeamId} onChange={handleChange} className="input-field" required>
                <option value="">Select away team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <Input label="Match Date" name="matchDate" type="datetime-local" value={formData.matchDate} onChange={handleChange} required />
            <Input label="Stadium" name="stadium" value={formData.stadium} onChange={handleChange} required />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Home Score" name="scoreHome" type="number" value={formData.scoreHome} onChange={handleChange} />
              <Input label="Away Score" name="scoreAway" type="number" value={formData.scoreAway} onChange={handleChange} />
              <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                <option value="scheduled">Scheduled</option>
                <option value="played">Played</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={saving}>
                <span>{saving ? "Saving..." : editingMatch ? "Update Match" : "Create Match"}</span>
              </Button>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Matches;
