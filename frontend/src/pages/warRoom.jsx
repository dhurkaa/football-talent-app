import React, { useEffect, useMemo, useState } from "react";
import { HiClock, HiLightningBolt, HiOutlineClipboardList, HiSpeakerphone } from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { overviewAPI } from "../services/api";

const WarRoom = () => {
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const response = await overviewAPI.getWorkspace();
      setWorkspace(response.data);
      setLoading(false);
    };

    fetchWorkspace();
  }, []);

  const pipeline = useMemo(() => {
    if (!workspace) {
      return [];
    }

    const reportedPlayerIds = new Set(workspace.reports.map((report) => report.playerId));
    const needsReports = workspace.players.filter((player) => !reportedPlayerIds.has(player.id)).slice(0, 5);
    const strongReports = workspace.reports.filter((report) => report.score >= 8).slice(0, 5);
    const upcomingMatches = workspace.matches
      .filter((match) => new Date(match.date).getTime() >= Date.now())
      .slice(0, 5);

    return [
      {
        stage: "Needs report",
        owner: "Player records without a scout report yet",
        items: needsReports.map((player) => player.name),
        action: "Write scouting reports for the players still missing actual evaluation."
      },
      {
        stage: "Ready for review",
        owner: "High-scoring reports already in the system",
        items: strongReports.map((report) => report.player),
        action: "Review the strongest reports and decide who moves into a final shortlist."
      },
      {
        stage: "Upcoming live scouting",
        owner: "Future matches saved in your workspace",
        items: upcomingMatches.map((match) => `${match.home} vs ${match.away}`),
        action: "Confirm which fixtures need attendance, follow-up, or post-match reporting."
      }
    ].filter((stage) => stage.items.length);
  }, [workspace]);

  if (loading) {
    return <Loading text="Loading war room..." />;
  }

  const alerts = [
    !(workspace?.players || []).length && "No players are stored yet, so your scouting pipeline is still empty.",
    !(workspace?.reports || []).length && "No scout reports are saved yet, so decisions still lack written evidence.",
    !(workspace?.matches || []).length && "No matches are scheduled yet, so the live coverage side of the workflow is missing."
  ].filter(Boolean);

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Scout War Room</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            The operating view for <span className="gradient-text">real decisions in motion</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-300">
            This board is now generated from the signed-in user's players, reports, matches, and live Premier League headlines.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Players tracked", value: workspace?.players?.length || 0, note: "User-owned records", icon: HiLightningBolt },
            { label: "Reports filed", value: workspace?.reports?.length || 0, note: "Evidence available", icon: HiOutlineClipboardList },
            { label: "Live news items", value: workspace?.news?.length || 0, note: "Premier League feed", icon: HiSpeakerphone },
            { label: "Upcoming fixtures", value: workspace?.matches?.filter((match) => new Date(match.date).getTime() >= Date.now()).length || 0, note: "Needs scheduling decisions", icon: HiClock }
          ].map((item) => (
            <Card key={item.label} className="p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-dark-500">{item.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiOutlineClipboardList className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Decision pipeline</h2>
            </div>
            {pipeline.length ? (
              <div className="space-y-4">
                {pipeline.map((stage) => (
                  <div key={stage.stage} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{stage.stage}</p>
                        <p className="mt-1 text-sm text-dark-400">{stage.owner}</p>
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">
                        {stage.items.length} item{stage.items.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stage.items.map((item) => (
                        <span key={item} className="rounded-full border border-white/10 bg-dark-950/60 px-3 py-1 text-xs font-medium text-dark-200">
                          {item}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-dark-300">{stage.action}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">No pipeline data yet. Add players, matches, and reports to bring this view to life.</p>
            )}
          </Card>

          <div className="space-y-8">
            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiClock className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Latest headlines</h2>
              </div>
              <div className="space-y-4">
                {(workspace?.news || []).slice(0, 4).map((item) => (
                  <a key={item.id} href={item.link} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/5 bg-dark-900/50 p-4 transition-colors hover:border-primary-500/30">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-dark-300">{item.description}</p>
                  </a>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <HiSpeakerphone className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Active alerts</h2>
              </div>
              {alerts.length ? (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert} className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                      {alert}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                  Your workspace has players, reports, and matches in place. The remaining work is prioritization, not cleanup.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarRoom;
