import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { HiClipboardCheck, HiExclamation, HiPencil, HiPlus, HiSparkles, HiTrash, HiUserGroup } from "react-icons/hi";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Loading from "../components/common/Loading";
import Modal from "../components/common/Modal";
import { playerAPI, reportAPI, scoutCrudAPI } from "../services/api";

const emptyScoutForm = {
  fullName: "",
  experienceYears: "",
  region: "",
  email: ""
};

const emptyReportForm = {
  playerId: "",
  scoutId: "",
  rating: "",
  strengths: "",
  weaknesses: "",
  recommendation: ""
};

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [players, setPlayers] = useState([]);
  const [scouts, setScouts] = useState([]);
  const [scoutModalOpen, setScoutModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [editingScout, setEditingScout] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [scoutForm, setScoutForm] = useState(emptyScoutForm);
  const [reportForm, setReportForm] = useState(emptyReportForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [reportsResponse, playersResponse, scoutsResponse] = await Promise.all([
      reportAPI.getAll(),
      playerAPI.getAll(),
      scoutCrudAPI.getAll()
    ]);
    setReports(reportsResponse.data);
    setPlayers(playersResponse.data);
    setScouts(scoutsResponse.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Reports in queue", value: reports.length, icon: HiClipboardCheck },
      { label: "Priority targets", value: reports.filter((report) => report.score >= 8).length, icon: HiSparkles },
      { label: "Scouts available", value: scouts.length, icon: HiUserGroup },
      { label: "Needs follow-up", value: reports.filter((report) => report.score < 6).length, icon: HiExclamation }
    ],
    [reports, scouts]
  );

  const handleScoutChange = (event) => {
    setScoutForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleReportChange = (event) => {
    setReportForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const openScoutCreate = () => {
    setEditingScout(null);
    setScoutForm(emptyScoutForm);
    setScoutModalOpen(true);
  };

  const openScoutEdit = (scout) => {
    setEditingScout(scout);
    setScoutForm({
      fullName: scout.fullName || "",
      experienceYears: scout.experienceYears || "",
      region: scout.region || "",
      email: scout.email || ""
    });
    setScoutModalOpen(true);
  };

  const openReportCreate = () => {
    setEditingReport(null);
    setReportForm({
      ...emptyReportForm,
      playerId: players[0]?.id || "",
      scoutId: scouts[0]?._id || ""
    });
    setReportModalOpen(true);
  };

  const openReportEdit = (report) => {
    setEditingReport(report);
    setReportForm({
      playerId: report.playerId || "",
      scoutId: report.scoutId?._id || report.scoutId || "",
      rating: report.score || "",
      strengths: Array.isArray(report.strengths) ? report.strengths.join(", ") : "",
      weaknesses: Array.isArray(report.weaknesses) ? report.weaknesses.join(", ") : "",
      recommendation: report.recommendation || report.summary || ""
    });
    setReportModalOpen(true);
  };

  const handleScoutSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      fullName: scoutForm.fullName,
      experienceYears: Number(scoutForm.experienceYears),
      region: scoutForm.region,
      email: scoutForm.email
    };

    try {
      if (editingScout) {
        await scoutCrudAPI.update(editingScout._id, payload);
        toast.success("Scout updated successfully.");
      } else {
        await scoutCrudAPI.create(payload);
        toast.success("Scout created successfully.");
      }
      setScoutModalOpen(false);
      setScoutForm(emptyScoutForm);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save scout.");
    } finally {
      setSaving(false);
    }
  };

  const toArray = (value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleReportSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      playerId: reportForm.playerId,
      scoutId: reportForm.scoutId,
      rating: Number(reportForm.rating),
      strengths: toArray(reportForm.strengths || ""),
      weaknesses: toArray(reportForm.weaknesses || ""),
      recommendation: reportForm.recommendation
    };

    try {
      if (editingReport) {
        await reportAPI.update(editingReport.id, payload);
        toast.success("Report updated successfully.");
      } else {
        await reportAPI.create(payload);
        toast.success("Report created successfully.");
      }
      setReportModalOpen(false);
      setReportForm(emptyReportForm);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save report.");
    } finally {
      setSaving(false);
    }
  };

  const handleScoutDelete = async (scout) => {
    if (!window.confirm(`Delete scout ${scout.fullName}?`)) return;
    try {
      await scoutCrudAPI.delete(scout._id);
      toast.success("Scout deleted successfully.");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete scout.");
    }
  };

  const handleReportDelete = async (report) => {
    if (!window.confirm(`Delete report for ${report.player}?`)) return;
    try {
      await reportAPI.delete(report.id);
      toast.success("Report deleted successfully.");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete report.");
    }
  };

  if (loading) {
    return <Loading text="Loading scout reports..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">
              Scout <span className="gradient-text">Reports</span>
            </h1>
            <p className="mt-2 text-dark-400">
              Ketu i ke CRUD per scouts dhe scout reports brenda faqes ekzistuese.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={openScoutCreate}>
              <HiPlus className="h-4 w-4" />
              <span>Add Scout</span>
            </Button>
            <Button onClick={openReportCreate}>
              <HiPlus className="h-4 w-4" />
              <span>Add Report</span>
            </Button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-white">Scout Manager</h2>
              <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">{scouts.length} scouts</span>
            </div>
            <div className="space-y-3">
              {scouts.map((scout) => (
                <div key={scout._id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <p className="font-semibold text-white">{scout.fullName}</p>
                  <p className="mt-1 text-sm text-dark-400">
                    {scout.region} - {scout.experienceYears} years
                  </p>
                  <p className="mt-1 text-sm text-dark-300">{scout.email}</p>
                  <div className="mt-4 flex gap-3">
                    <Button variant="secondary" className="text-sm" onClick={() => openScoutEdit(scout)}>
                      <HiPencil className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                    <Button variant="secondary" className="text-sm border-red-500/20 text-red-300 hover:bg-red-500/10" onClick={() => handleScoutDelete(scout)}>
                      <HiTrash className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                        {report.verdict}
                      </span>
                      <span className="text-sm text-dark-400">{new Date(report.date).toLocaleDateString("en-GB")}</span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-white">{report.player}</h2>
                    <p className="mt-1 text-sm text-dark-400">
                      {report.club} - {report.roleFit} - by {report.author}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-dark-300">{report.summary}</p>
                  </div>

                  <div className="min-w-[180px] rounded-2xl border border-white/5 bg-dark-900/50 p-5 text-center">
                    <p className="text-xs uppercase tracking-wider text-dark-400">Scout score</p>
                    <p className="mt-2 text-4xl font-bold text-white">{report.score}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-amber-300">Primary risk</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{report.risks}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-emerald-300">Recommendation</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{report.recommendation}</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <Button variant="secondary" className="text-sm" onClick={() => openReportEdit(report)}>
                    <HiPencil className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                  <Button variant="secondary" className="text-sm border-red-500/20 text-red-300 hover:bg-red-500/10" onClick={() => handleReportDelete(report)}>
                    <HiTrash className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Modal open={scoutModalOpen} onClose={() => setScoutModalOpen(false)} title={editingScout ? "Edit Scout" : "Add Scout"}>
          <form onSubmit={handleScoutSubmit} className="space-y-4">
            <Input label="Full Name" name="fullName" value={scoutForm.fullName} onChange={handleScoutChange} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Experience Years" name="experienceYears" type="number" value={scoutForm.experienceYears} onChange={handleScoutChange} required />
              <Input label="Region" name="region" value={scoutForm.region} onChange={handleScoutChange} required />
            </div>
            <Input label="Email" name="email" type="email" value={scoutForm.email} onChange={handleScoutChange} required />
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={saving}>
                <span>{saving ? "Saving..." : editingScout ? "Update Scout" : "Create Scout"}</span>
              </Button>
              <Button type="button" variant="secondary" onClick={() => setScoutModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        <Modal open={reportModalOpen} onClose={() => setReportModalOpen(false)} title={editingReport ? "Edit Report" : "Add Report"}>
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <select name="playerId" value={reportForm.playerId} onChange={handleReportChange} className="input-field" required>
              <option value="">Select player</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} - {player.position}
                </option>
              ))}
            </select>
            <select name="scoutId" value={reportForm.scoutId} onChange={handleReportChange} className="input-field" required>
              <option value="">Select scout</option>
              {scouts.map((scout) => (
                <option key={scout._id} value={scout._id}>
                  {scout.fullName} - {scout.region}
                </option>
              ))}
            </select>
            <Input label="Rating" name="rating" type="number" min="1" max="10" value={reportForm.rating} onChange={handleReportChange} required />
            <Input label="Strengths" name="strengths" value={reportForm.strengths} onChange={handleReportChange} placeholder="Comma separated" />
            <Input label="Weaknesses" name="weaknesses" value={reportForm.weaknesses} onChange={handleReportChange} placeholder="Comma separated" />
            <textarea
              name="recommendation"
              value={reportForm.recommendation}
              onChange={handleReportChange}
              placeholder="Recommendation"
              className="input-field min-h-[120px]"
              required
            />
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={saving}>
                <span>{saving ? "Saving..." : editingReport ? "Update Report" : "Create Report"}</span>
              </Button>
              <Button type="button" variant="secondary" onClick={() => setReportModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Reports;
