import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiAdjustments,
  HiArrowSmDown,
  HiArrowSmUp,
  HiChartPie,
  HiClipboardCheck,
  HiDocumentDownload,
  HiFilm,
  HiFingerPrint,
  HiLightningBolt,
  HiSearch,
  HiSparkles,
  HiTemplate,
  HiUpload
} from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import SkillRadar from "../components/player/SkillRadar";
import { playerAPI } from "../services/api";
import {
  analyzeDrillUploads,
  buildExportSections,
  buildTalentFingerprint,
  compareToBenchmarks,
  createTalentAlerts,
  evaluateMobileLab,
  generateBackgroundDossier,
  generateHighlightReel,
  getReferenceProfiles,
  getScoutingPlayerPool,
  runScoutCopilot,
  similaritySearch
} from "../services/scoutingLab";

const defaultDrills = [
  { type: "sprint", label: "30m sprint", timeSeconds: "4.08", quality: "6", repetitions: "2", notes: "", fileName: "" },
  { type: "agility", label: "5-10-5 agility", timeSeconds: "4.61", quality: "5", repetitions: "3", notes: "", fileName: "" },
  { type: "finishing", label: "Finishing circuit", timeSeconds: "8.40", quality: "7", repetitions: "6", notes: "", fileName: "" }
];

const positionOptions = ["", "GK", "DEF", "CB", "MID", "CM", "FWD", "ST", "LW", "RW"];

const HeatTile = ({ label, value }) => (
  <div
    className="rounded-xl border border-white/5 p-3"
    style={{
      background: `linear-gradient(180deg, rgba(34,197,94,${0.08 + value / 40}), rgba(15,23,42,0.85))`
    }}
  >
    <p className="text-[11px] uppercase tracking-[0.18em] text-dark-400">{label}</p>
    <p className="mt-2 text-xl font-bold text-white">{value}</p>
  </div>
);

const MetricPill = ({ label, value, tone = "text-primary-300" }) => (
  <div className="rounded-xl border border-white/5 bg-dark-950/60 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.18em] text-dark-400">{label}</p>
    <p className={`mt-2 text-lg font-semibold ${tone}`}>{value}</p>
  </div>
);

const AILab = () => {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [referenceId, setReferenceId] = useState("alphonso-davies");
  const [copilotQuery, setCopilotQuery] = useState("show me U21 wingers with elite acceleration and high pressing intensity");
  const [alertFilters, setAlertFilters] = useState({
    position: "RW",
    maxAge: "21",
    minAcceleration: "85",
    minPressing: "76",
    minRating: "8.3"
  });
  const [drills, setDrills] = useState(defaultDrills);
  const [highlightInput, setHighlightInput] = useState({ matchFileName: "", matchLabel: "Showcase Matchday 28" });
  const [mobileLabInput, setMobileLabInput] = useState({
    sprint10: "1.76",
    sprint30: "4.02",
    shotSpeed: "101",
    jumpHeight: "47",
    sensorConfidence: "84"
  });
  const [sectionOrder, setSectionOrder] = useState([]);
  const [draggedSectionId, setDraggedSectionId] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await playerAPI.getAll();
      const pool = getScoutingPlayerPool(response.data || []);
      setPlayers(pool);
      setSelectedPlayerId(pool[0]?.id || "");
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  const selectedPlayer = useMemo(
    () => players.find((player) => player.id === selectedPlayerId) || players[0] || null,
    [players, selectedPlayerId]
  );

  const fingerprint = useMemo(() => (selectedPlayer ? buildTalentFingerprint(selectedPlayer) : null), [selectedPlayer]);
  const benchmark = useMemo(() => (selectedPlayer ? compareToBenchmarks(selectedPlayer) : null), [selectedPlayer]);
  const dossier = useMemo(() => (selectedPlayer ? generateBackgroundDossier(selectedPlayer) : null), [selectedPlayer]);
  const similarityMatches = useMemo(
    () => similaritySearch({ players, referenceId, referencePlayerId: selectedPlayerId }),
    [players, referenceId, selectedPlayerId]
  );
  const copilotResult = useMemo(() => runScoutCopilot({ players, query: copilotQuery }), [players, copilotQuery]);
  const drillAnalysis = useMemo(() => analyzeDrillUploads(drills), [drills]);
  const highlightReel = useMemo(
    () => (selectedPlayer ? generateHighlightReel({ player: selectedPlayer, ...highlightInput }) : null),
    [selectedPlayer, highlightInput]
  );
  const alerts = useMemo(() => createTalentAlerts({ players, filters: alertFilters }), [players, alertFilters]);
  const mobileLabResult = useMemo(() => evaluateMobileLab(mobileLabInput), [mobileLabInput]);
  const exportSections = useMemo(() => (selectedPlayer ? buildExportSections(selectedPlayer) : []), [selectedPlayer]);
  const orderedSections = useMemo(() => {
    if (!exportSections.length) return [];
    if (!sectionOrder.length) return exportSections;
    return sectionOrder
      .map((id) => exportSections.find((section) => section.id === id))
      .filter(Boolean);
  }, [exportSections, sectionOrder]);

  useEffect(() => {
    if (exportSections.length) {
      setSectionOrder(exportSections.map((section) => section.id));
    }
  }, [selectedPlayerId]);

  if (loading) {
    return <Loading text="Booting the AI scouting lab..." />;
  }

  const updateDrill = (index, key, value) => {
    setDrills((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  };

  const moveSection = (index, direction) => {
    setSectionOrder((current) => {
      const next = [...current];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleDrop = (targetId) => {
    if (!draggedSectionId || draggedSectionId === targetId) return;

    setSectionOrder((current) => {
      const next = [...current];
      const from = next.indexOf(draggedSectionId);
      const to = next.indexOf(targetId);
      if (from === -1 || to === -1) return current;
      next.splice(from, 1);
      next.splice(to, 0, draggedSectionId);
      return next;
    });
    setDraggedSectionId(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2 text-sm font-semibold text-primary-300">
            <HiSparkles className="h-4 w-4" />
            <span>AI Scouting Lab</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
            Complete <span className="gradient-text">talent operating system</span>
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-dark-300">
            This workspace turns your player pool into a working AI scouting stack: drill scoring, similarity search,
            highlight generation, scout copilot querying, fingerprint visuals, maturity-aware benchmarking, dossier
            generation, talent alerts, mobile testing, and export-ready scout packs.
          </p>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Players indexed", value: players.length, note: "Shared player pool for every AI feature", icon: HiSearch },
            { label: "Reference archetypes", value: getReferenceProfiles().length, note: "Style matching templates", icon: HiFingerPrint },
            { label: "Active alert hits", value: alerts.length, note: "Current filters evaluated live", icon: HiLightningBolt },
            { label: "Export modules", value: orderedSections.length, note: "Ready for print-to-PDF workflow", icon: HiDocumentDownload }
          ].map((item) => (
            <Card key={item.label} className="p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-dark-500">{item.note}</p>
            </Card>
          ))}
        </div>

        <Card className="mb-8 p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-300">Command center</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Pick the player everything updates around</h2>
              <p className="mt-2 text-sm leading-relaxed text-dark-300">
                The panels below recompute live from this selected player and your current AI filters.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select value={selectedPlayerId} onChange={(event) => setSelectedPlayerId(event.target.value)} className="input-field">
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name} - {player.position}
                  </option>
                ))}
              </select>
              <select value={referenceId} onChange={(event) => setReferenceId(event.target.value)} className="input-field">
                {getReferenceProfiles().map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <div className="grid gap-8">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiUpload className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">1. AI video drill scoring from any phone camera</h2>
              </div>
              <div className="space-y-4">
                {drills.map((drill, index) => (
                  <div key={drill.label} className="rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">{drill.label}</p>
                      <label className="cursor-pointer rounded-xl border border-primary-500/20 bg-primary-500/10 px-3 py-2 text-sm font-medium text-primary-300">
                        Attach clip
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(event) => updateDrill(index, "fileName", event.target.files?.[0]?.name || "")}
                        />
                      </label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <select value={drill.type} onChange={(event) => updateDrill(index, "type", event.target.value)} className="input-field">
                        <option value="sprint">Sprint</option>
                        <option value="agility">Agility</option>
                        <option value="finishing">Finishing</option>
                      </select>
                      <input
                        value={drill.timeSeconds}
                        onChange={(event) => updateDrill(index, "timeSeconds", event.target.value)}
                        className="input-field"
                        placeholder="Time (s)"
                      />
                      <input
                        value={drill.repetitions}
                        onChange={(event) => updateDrill(index, "repetitions", event.target.value)}
                        className="input-field"
                        placeholder="Reps"
                      />
                      <input
                        value={drill.quality}
                        onChange={(event) => updateDrill(index, "quality", event.target.value)}
                        className="input-field"
                        placeholder="Execution 1-7"
                      />
                    </div>
                    <textarea
                      value={drill.notes}
                      onChange={(event) => updateDrill(index, "notes", event.target.value)}
                      className="input-field mt-4"
                      placeholder="Optional scout notes from the phone capture"
                    />
                    <p className="mt-3 text-xs text-dark-500">{drill.fileName || "No clip selected yet."}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <MetricPill label="Composite" value={drillAnalysis.composite} />
                <MetricPill label="Speed" value={drillAnalysis.results[0]?.speedScore || "-"} />
                <MetricPill label="Technique" value={drillAnalysis.results[1]?.techniqueScore || "-"} />
                <MetricPill label="Coordination" value={drillAnalysis.results[2]?.coordinationScore || "-"} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-dark-300">{drillAnalysis.recommendation}</p>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiSearch className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">2. “Find me the next X” similarity search</h2>
              </div>
              <div className="space-y-4">
                {similarityMatches.map((match) => (
                  <div key={match.id} className="rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{match.name}</p>
                        <p className="mt-1 text-sm text-dark-400">
                          {match.position} - {match.club}
                        </p>
                      </div>
                      <div className="rounded-xl border border-primary-500/20 bg-primary-500/10 px-4 py-2 text-right">
                        <p className="text-xs uppercase tracking-[0.18em] text-primary-300">Similarity</p>
                        <p className="text-2xl font-bold text-white">{match.similarity}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {match.matchReasons.map((reason) => (
                        <span key={reason} className="rounded-full border border-white/10 bg-dark-900 px-3 py-1 text-xs text-dark-200">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiFilm className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">3. Auto-generated highlight reels from raw matches</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="cursor-pointer rounded-2xl border border-dashed border-white/10 bg-dark-950/60 p-4 text-sm text-dark-300">
                  Upload full-match file
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(event) =>
                      setHighlightInput((current) => ({
                        ...current,
                        matchFileName: event.target.files?.[0]?.name || ""
                      }))
                    }
                  />
                  <p className="mt-3 text-xs text-dark-500">{highlightInput.matchFileName || "No match file selected yet."}</p>
                </label>
                <input
                  value={highlightInput.matchLabel}
                  onChange={(event) => setHighlightInput((current) => ({ ...current, matchLabel: event.target.value }))}
                  className="input-field"
                  placeholder="Match label"
                />
              </div>
              {highlightReel ? (
                <div className="mt-5 rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                  <p className="font-semibold text-white">{highlightReel.title}</p>
                  <p className="mt-2 text-sm text-dark-300">{highlightReel.summary}</p>
                  <div className="mt-4 space-y-3">
                    {highlightReel.clips.map((clip) => (
                      <div key={`${clip.label}-${clip.timestamp}`} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-dark-900/70 p-3">
                        <div>
                          <p className="font-medium text-white">
                            {clip.timestamp} - {clip.label}
                          </p>
                          <p className="text-sm text-dark-400">{clip.description}</p>
                        </div>
                        <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">{clip.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiSparkles className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">4. Live scout copilot chat</h2>
              </div>
              <textarea
                value={copilotQuery}
                onChange={(event) => setCopilotQuery(event.target.value)}
                className="input-field"
                placeholder="Ask the copilot for player shortlists"
              />
              <div className="mt-4 rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                <p className="text-sm leading-relaxed text-dark-300">{copilotResult.summary}</p>
              </div>
              <div className="mt-4 space-y-3">
                {copilotResult.shortlist.map((player) => (
                  <div key={player.id} className="rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">{player.name}</p>
                      <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">
                        {player.position} - {player.rating}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{player.note}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiChartPie className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">5. Dynamic radar + heatmap “talent fingerprint”</h2>
              </div>
              {selectedPlayer && fingerprint ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <SkillRadar skills={fingerprint.radar} />
                    <div className="grid grid-cols-2 gap-3">
                      {fingerprint.heatmap.map((zone) => (
                        <HeatTile key={zone.label} label={zone.label} value={zone.value} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-dark-300">
                    The radar blends physical, technical, tactical, creativity, duel power, and end product. The heat
                    map is generated from role bias plus profile strengths, so it updates instantly when the selected
                    player changes.
                  </p>
                </>
              ) : null}
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiAdjustments className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">6. Global benchmarks & maturity-aware comparisons</h2>
              </div>
              {benchmark ? (
                <>
                  <div className="rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-300">{benchmark.maturityLabel}</p>
                    <p className="mt-3 text-sm leading-relaxed text-dark-300">{benchmark.summary}</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {benchmark.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-medium text-white">{metric.label}</p>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              metric.status === "ahead"
                                ? "bg-emerald-500/10 text-emerald-300"
                                : metric.status === "on track"
                                  ? "bg-primary-500/10 text-primary-300"
                                  : "bg-amber-500/10 text-amber-300"
                            }`}
                          >
                            {metric.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-dark-300">
                          Player: <span className="text-white">{metric.player}</span> | Benchmark:{" "}
                          <span className="text-white">{metric.benchmark}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </Card>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiClipboardCheck className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">7. Automatic background dossier builder</h2>
              </div>
              {dossier ? (
                <div className="space-y-4">
                  {[
                    ["Headline", dossier.headline],
                    ["Injury history", dossier.injuryHistory],
                    ["Transfer context", dossier.transferContext]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-dark-400">{label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-dark-300">{value}</p>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-dark-400">Media signals</p>
                    <div className="mt-3 space-y-2">
                      {dossier.mediaSignals.map((item) => (
                        <p key={item} className="text-sm leading-relaxed text-dark-300">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiLightningBolt className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">8. Smart talent alerts across all leagues/portals</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-5">
                <select
                  value={alertFilters.position}
                  onChange={(event) => setAlertFilters((current) => ({ ...current, position: event.target.value }))}
                  className="input-field"
                >
                  {positionOptions.map((position) => (
                    <option key={position || "all"} value={position}>
                      {position || "Any position"}
                    </option>
                  ))}
                </select>
                <input
                  value={alertFilters.maxAge}
                  onChange={(event) => setAlertFilters((current) => ({ ...current, maxAge: event.target.value }))}
                  className="input-field"
                  placeholder="Max age"
                />
                <input
                  value={alertFilters.minAcceleration}
                  onChange={(event) =>
                    setAlertFilters((current) => ({ ...current, minAcceleration: event.target.value }))
                  }
                  className="input-field"
                  placeholder="Min acceleration"
                />
                <input
                  value={alertFilters.minPressing}
                  onChange={(event) => setAlertFilters((current) => ({ ...current, minPressing: event.target.value }))}
                  className="input-field"
                  placeholder="Min pressing"
                />
                <input
                  value={alertFilters.minRating}
                  onChange={(event) => setAlertFilters((current) => ({ ...current, minRating: event.target.value }))}
                  className="input-field"
                  placeholder="Min rating"
                />
              </div>
              <div className="mt-4 space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.playerId} className="rounded-2xl border border-white/5 bg-dark-950/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">{alert.title}</p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          alert.urgency === "High" ? "bg-amber-500/10 text-amber-300" : "bg-primary-500/10 text-primary-300"
                        }`}
                      >
                        {alert.urgency}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-dark-300">{alert.note}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiTemplate className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">9. Mobile performance lab in your pocket</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-5">
                {[
                  ["sprint10", "10m sprint"],
                  ["sprint30", "30m sprint"],
                  ["shotSpeed", "Shot speed"],
                  ["jumpHeight", "Jump height"],
                  ["sensorConfidence", "Sensor confidence"]
                ].map(([key, label]) => (
                  <input
                    key={key}
                    value={mobileLabInput[key]}
                    onChange={(event) => setMobileLabInput((current) => ({ ...current, [key]: event.target.value }))}
                    className="input-field"
                    placeholder={label}
                  />
                ))}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <MetricPill label="Acceleration" value={mobileLabResult.accelerationScore} />
                <MetricPill label="Speed" value={mobileLabResult.speedScore} />
                <MetricPill label="Power" value={mobileLabResult.powerScore} />
                <MetricPill label="Reliability" value={`${mobileLabResult.reliability}%`} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-dark-300">{mobileLabResult.summary}</p>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiDocumentDownload className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">10. One-click pro-grade scout report exports</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-dark-300">
                Drag sections into order, then use the browser print flow for a clean PDF export or presentation handoff.
              </p>
              <div className="space-y-3">
                {orderedSections.map((section, index) => (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={() => setDraggedSectionId(section.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(section.id)}
                    className="rounded-2xl border border-white/5 bg-dark-950/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">{section.title}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => moveSection(index, -1)} className="btn-secondary px-3 py-2 text-sm">
                          <HiArrowSmUp className="h-4 w-4" />
                        </button>
                        <button onClick={() => moveSection(index, 1)} className="btn-secondary px-3 py-2 text-sm">
                          <HiArrowSmDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{section.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => window.print()} className="btn-primary">
                  <HiDocumentDownload className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(orderedSections.map((section) => `${section.title}\n${section.content}`).join("\n\n"))}
                  className="btn-secondary"
                >
                  <HiClipboardCheck className="h-4 w-4" />
                  <span>Copy pack</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILab;
