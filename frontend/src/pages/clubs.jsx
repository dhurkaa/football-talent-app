import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { HiGlobe, HiPencil, HiPlus, HiSearch, HiTrash, HiTrendingUp, HiUserGroup } from "react-icons/hi";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import Modal from "../components/common/Modal";
import { teamAPI } from "../services/api";

const emptyForm = {
  name: "",
  city: "",
  foundedYear: "",
  coachName: "",
  stadium: "",
  leagueName: "",
  squadSize: "",
  averageAge: "",
  totalMarketValue: "",
  averageMarketValue: "",
  style: "",
  priorityNeed: "",
  note: ""
};

const Clubs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchTeams = async () => {
    const response = await teamAPI.getAll();
    setTeams(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredClubs = useMemo(() => {
    return teams.filter((club) =>
      `${club.name} ${club.city} ${club.coachName} ${club.leagueName} ${club.priorityNeed || ""} ${club.style || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, teams]);

  const openCreateModal = () => {
    setEditingClub(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (club) => {
    setEditingClub(club);
    setFormData({
      name: club.name || "",
      city: club.city || "",
      foundedYear: club.foundedYear || "",
      coachName: club.coachName || "",
      stadium: club.stadium || "",
      leagueName: club.leagueName || "",
      squadSize: club.squadSize || "",
      averageAge: club.averageAge || "",
      totalMarketValue: club.totalMarketValue || "",
      averageMarketValue: club.averageMarketValue || "",
      style: club.style || "",
      priorityNeed: club.priorityNeed || "",
      note: club.note || ""
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
      ...formData,
      foundedYear: Number(formData.foundedYear),
      squadSize: Number(formData.squadSize || 0),
      averageAge: Number(formData.averageAge || 0),
      totalMarketValue: Number(formData.totalMarketValue || 0),
      averageMarketValue: Number(formData.averageMarketValue || 0)
    };

    try {
      if (editingClub) {
        await teamAPI.update(editingClub.id, payload);
        toast.success("Club updated successfully.");
      } else {
        await teamAPI.create(payload);
        toast.success("Club created successfully.");
      }

      setModalOpen(false);
      setFormData(emptyForm);
      setEditingClub(null);
      fetchTeams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save club.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (club) => {
    if (!window.confirm(`Delete ${club.name}?`)) return;

    try {
      await teamAPI.delete(club.id);
      toast.success("Club deleted successfully.");
      fetchTeams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete club.");
    }
  };

  if (loading) {
    return <Loading text="Loading clubs..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">
              Club <span className="gradient-text">Directory</span>
            </h1>
            <p className="mt-2 text-dark-400">
              Ketu i ke edhe club cards edhe CRUD per teams, pa shtuar faqe te reja.
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <HiPlus className="h-4 w-4" />
            <span>Add Club</span>
          </Button>
        </div>

        <div className="glass-card mb-8 p-6">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search clubs, cities, coaches, leagues, styles, or needs..."
              className="input-field pl-12"
            />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Tracked clubs", value: teams.length, icon: HiUserGroup },
            { label: "Cities covered", value: new Set(teams.map((club) => club.city)).size, icon: HiGlobe },
            { label: "With squad info", value: teams.filter((club) => club.squadSize > 0).length, icon: HiTrendingUp }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{club.name}</h2>
                  <p className="mt-1 text-sm text-dark-400">
                    {club.leagueName} - {club.city}
                  </p>
                </div>
                <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                  {club.coachName}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Founded", value: club.foundedYear || "Not set" },
                  { label: "Squad size", value: club.squadSize || 0 },
                  { label: "Average age", value: club.averageAge || "Not set" },
                  { label: "Stadium", value: club.stadium }
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-dark-400">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-primary-300">Recruitment need</p>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">{club.priorityNeed || "Needs review"}</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-emerald-300">Style</p>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">{club.style || "Not set"}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/5 bg-dark-900/50 p-4">
                <p className="text-xs uppercase tracking-wider text-dark-400">Scout note</p>
                <p className="mt-2 text-sm leading-relaxed text-dark-300">{club.note}</p>
              </div>

              <div className="mt-5 flex gap-3">
                <Button variant="secondary" className="text-sm" onClick={() => openEditModal(club)}>
                  <HiPencil className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button variant="secondary" className="text-sm border-red-500/20 text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(club)}>
                  <HiTrash className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingClub ? "Edit Club" : "Add Club"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Club Name" name="name" value={formData.name} onChange={handleChange} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
              <Input label="Founded Year" name="foundedYear" type="number" value={formData.foundedYear} onChange={handleChange} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Coach Name" name="coachName" value={formData.coachName} onChange={handleChange} required />
              <Input label="Stadium" name="stadium" value={formData.stadium} onChange={handleChange} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="League Name" name="leagueName" value={formData.leagueName} onChange={handleChange} required />
              <Input label="Squad Size" name="squadSize" type="number" value={formData.squadSize} onChange={handleChange} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Average Age" name="averageAge" type="number" value={formData.averageAge} onChange={handleChange} />
              <Input label="Priority Need" name="priorityNeed" value={formData.priorityNeed} onChange={handleChange} />
            </div>
            <Input label="Style" name="style" value={formData.style} onChange={handleChange} />
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Scout note"
              className="input-field min-h-[110px]"
            />
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={saving}>
                <span>{saving ? "Saving..." : editingClub ? "Update Club" : "Create Club"}</span>
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

export default Clubs;
