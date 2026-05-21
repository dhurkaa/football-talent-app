import React, { useEffect, useMemo, useState } from "react";
import { HiBadgeCheck, HiClock, HiPlay, HiPresentationChartBar } from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { overviewAPI } from "../services/api";

const agenda = [
  { step: "Open on live market context", description: "Use the latest Premier League headlines to anchor the conversation in what is happening now." },
  { step: "Show your strongest names", description: "Move into the real players with the best output in your own workspace." },
  { step: "Back the case with reports", description: "Use stored scouting reports as the evidence layer behind each recommendation." },
  { step: "Close with fixtures and next actions", description: "Finish on upcoming matches and the immediate follow-up work still needed." }
];

const Presentation = () => {
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

  const featuredPlayers = useMemo(() => {
    const players = workspace?.players || [];
    return [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 4);
  }, [workspace]);

  if (loading) {
    return <Loading text="Preparing presentation mode..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Presentation Mode</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">A walkthrough built from real workspace data</h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-300">
            This page now uses your own stored players, reports, matches, and live Premier League news instead of a demo script.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: "Agenda steps", value: agenda.length, icon: HiPresentationChartBar },
            { label: "Featured players", value: featuredPlayers.length, icon: HiBadgeCheck },
            { label: "Stored reports", value: workspace?.reports?.length || 0, icon: HiPlay },
            { label: "Live news cards", value: workspace?.news?.length || 0, icon: HiClock }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Walkthrough agenda</h2>
            <div className="space-y-4">
              {agenda.map((item, index) => (
                <div key={item.step} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-sm font-bold text-white">{index + 1}</div>
                    <p className="font-semibold text-white">{item.step}</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dark-300">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="mb-5 text-xl font-bold text-white">Open with these players</h2>
              {featuredPlayers.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {featuredPlayers.map((player) => (
                    <div key={player.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{player.name}</p>
                          <p className="mt-1 text-xs text-dark-400">
                            {player.position} · {player.marketValue}
                          </p>
                        </div>
                        <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">{player.goals} goals</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-dark-300">{player.scoutSummary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-400">Add players to populate this section.</p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="mb-5 text-xl font-bold text-white">Anchor the room with live news</h2>
              <div className="space-y-4">
                {(workspace?.news || []).slice(0, 3).map((item) => (
                  <a key={item.id} href={item.link} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/5 bg-dark-900/50 p-4 transition-colors hover:border-primary-500/30">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{item.description}</p>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation;
