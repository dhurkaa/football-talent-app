import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiPencil, HiPlus, HiSearch, HiSparkles, HiTrendingUp, HiTrash, HiViewGrid, HiViewList, HiX } from "react-icons/hi";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import Modal from "../components/common/Modal";
import PlayerCard from "../components/player/PlayerCard";
import { playerAPI, teamAPI } from "../services/api";

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
  matchesPlayed: ""
};

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [sortBy, setSortBy] = useState("goals");
  const [viewMode, setViewMode] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [playersResponse, teamsResponse] = await Promise.all([playerAPI.getAll(), teamAPI.getAll()]);
    setPlayers(playersResponse.data);
    setTeams(teamsResponse.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const positions = ["all", "GK", "DEF", "CB", "MID", "CM", "FWD", "ST", "LW", "RW"];

  const filteredPlayers = useMemo(() => {
    return [...players]
      .filter((player) => {
        const haystack = `${player.name} ${player.nationality || ""} ${player.club || ""}`.toLowerCase();
        const matchesSearch = haystack.includes(searchQuery.toLowerCase());
        const matchesPosition = selectedPosition === "all" || player.position === selectedPosition;
        return matchesSearch && matchesPosition;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "goals") return (b.goals || 0) - (a.goals || 0);
        if (sortBy === "age") return (a.age || 0) - (b.age || 0);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [players, searchQuery, selectedPosition, sortBy]);

  const topScorers = useMemo(() => [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 3), [players]);

  const openCreateModal = () => {
    setEditingPlayer(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    const matchingTeam = teams.find((team) => team.name === player.club);
    setFormData({
      fullName: player.name || "",
      age: player.age || "",
      position:
        player.apiPosition === "Unknown"
          ? "Forward"
          : player.apiPosition || "Forward",
      nationality: player.nationality || "",
      height: String(player.height || "").replace(" cm", ""),
      preferredFoot: player.foot || "Right",
      teamId: matchingTeam?.id || "",
      marketValue: String(player.marketValue || "").replace(/[^\d]/g, ""),
      goals: player.goals || "",
      assists: player.assists || "",
      matchesPlayed: player.matches || ""
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      fullName: formData.fullName,
      age: Number(formData.age),
      position: formData.position,
      nationality: formData.nationality,
      height: Number(formData.height || 0),
      preferredFoot: formData.preferredFoot,
      teamId: formData.teamId,
      marketValue: Number(formData.marketValue || 0),
      stats: {
        goals: Number(formData.goals || 0),
        assists: Number(formData.assists || 0),
        matchesPlayed: Number(formData.matchesPlayed || 0)
      }
    };

    try {
      if (editingPlayer) {
        await playerAPI.update(editingPlayer.id, payload);
        toast.success("Player updated successfully.");
      } else {
        await playerAPI.create(payload);
        toast.success("Player created successfully.");
      }

      setModalOpen(false);
      setEditingPlayer(null);
      setFormData(emptyForm);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save player.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (player) => {
    if (!window.confirm(`Delete ${player.name}?`)) return;

    try {
      await playerAPI.delete(player.id);
      toast.success("Player deleted successfully.");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete player.");
    }
  };

  if (loading) {
    return <Loading text="Discovering talent..." />;
  }

  const averageAge = players.length
    ? (players.reduce((sum, player) => sum + (player.age || 0), 0) / players.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">
              Discover <span className="gradient-text">Talent</span>
            </h1>
            <p className="mt-2 text-lg text-dark-400">
              Ketu i ke edhe player cards edhe CRUD per players, pa shtuar faqe te reja.
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <HiPlus className="h-4 w-4" />
            <span>Add Player</span>
          </Button>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            { label: "Verified player pool", value: players.length, icon: HiSparkles, note: "Live records plus fallback pool" },
            { label: "Average age", value: averageAge, icon: HiTrendingUp, note: "Across the current player pool" },
            { label: "Top scorer", value: topScorers[0]?.name || "-", icon: HiSparkles, note: `${topScorers[0]?.goals || 0} goals this season` }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-dark-500">{item.note}</p>
            </div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card mb-8 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <HiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, nationality, or club..."
                className="input-field pl-12"
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                  <HiX className="h-5 w-5" />
                </button>
              ) : null}
            </div>

            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="input-field w-full lg:w-48">
              <option value="goals">Sort by Goals</option>
              <option value="age">Sort by Age</option>
              <option value="name">Sort by Name</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-xl p-3 ${viewMode === "grid" ? "border border-primary-500/30 bg-primary-500/20 text-primary-300" : "glass text-dark-400 hover:text-white"}`}
              >
                <HiViewGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-xl p-3 ${viewMode === "list" ? "border border-primary-500/30 bg-primary-500/20 text-primary-300" : "glass text-dark-400 hover:text-white"}`}
              >
                <HiViewList className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
            {positions.map((position) => (
              <button
                key={position}
                onClick={() => setSelectedPosition(position)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedPosition === position
                    ? "bg-primary-500 text-white shadow-glow-green"
                    : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white"
                }`}
              >
                {position === "all" ? "All Positions" : position}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredPlayers.length ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filteredPlayers.map((player, index) => (
              <div key={player.id} className="space-y-3">
                <PlayerCard player={player} index={index} compact={viewMode === "list"} />
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1 text-sm" onClick={() => openEditModal(player)}>
                    <HiPencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 text-sm border-red-500/20 text-red-300 hover:bg-red-500/10"
                    onClick={() => handleDelete(player)}
                  >
                    <HiTrash className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <HiSearch className="mx-auto mb-4 h-16 w-16 text-dark-600" />
            <h3 className="text-xl font-semibold text-white">No players found</h3>
            <p className="mt-2 text-dark-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingPlayer ? "Edit Player" : "Add Player"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
              <Input label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="position" value={formData.position} onChange={handleChange} className="input-field" required>
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Forward">Forward</option>
              </select>
              <select name="preferredFoot" value={formData.preferredFoot} onChange={handleChange} className="input-field">
                <option value="Right">Right</option>
                <option value="Left">Left</option>
                <option value="Both">Both</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} />
              <Input label="Market Value" name="marketValue" type="number" value={formData.marketValue} onChange={handleChange} />
            </div>
            <select name="teamId" value={formData.teamId} onChange={handleChange} className="input-field" required>
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Goals" name="goals" type="number" value={formData.goals} onChange={handleChange} />
              <Input label="Assists" name="assists" type="number" value={formData.assists} onChange={handleChange} />
              <Input label="Matches" name="matchesPlayed" type="number" value={formData.matchesPlayed} onChange={handleChange} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={saving}>
                <span>{saving ? "Saving..." : editingPlayer ? "Update Player" : "Create Player"}</span>
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

export default Players;
