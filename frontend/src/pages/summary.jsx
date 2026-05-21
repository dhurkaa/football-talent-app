import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HiBadgeCheck, HiChartBar, HiLightningBolt, HiTrendingUp } from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { overviewAPI } from "../services/api";

const Summary = () => {
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

  const priorityPlayers = useMemo(() => {
    const players = workspace?.players || [];
    return [...players]
      .sort((a, b) => (b.goals || 0) - (a.goals || 0) || (b.matches || 0) - (a.matches || 0))
      .slice(0, 4);
  }, [workspace]);

  if (loading) {
    return <Loading text="Building your summary..." />;
  }

  const stats = workspace?.stats || {};
  const recommendations = [
    stats.teamCount ? "Your team records are in place, so new players and matches can be linked cleanly." : "Add a team first so the player and match data stays structured.",
    stats.playerCount ? "Your player pool is populated with real records instead of samples." : "No players are available yet, so shortlist and presentation views will stay sparse.",
    stats.reportCount ? "Scout reports exist, which means you can now make evidence-backed decisions." : "Write reports next to turn profiles into real scouting decisions."
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Executive Summary</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">A real picture of your scouting workspace</h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-300">
            This summary is built from the signed-in user's stored data and the latest Premier League news feed.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Players", value: stats.playerCount || 0, icon: HiChartBar, note: "Tracked by this user" },
            { label: "Reports", value: stats.reportCount || 0, icon: HiBadgeCheck, note: "Decision inputs available" },
            { label: "Matches", value: stats.matchCount || 0, icon: HiTrendingUp, note: "Scheduled or completed" },
            { label: "News items", value: workspace?.news?.length || 0, icon: HiLightningBolt, note: "Latest Premier League stories" }
          ].map((metric) => (
            <Card key={metric.label} className="p-5">
              <metric.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-dark-500">{metric.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Current recommendations</h2>
            <div className="space-y-3">
              {recommendations.map((item) => (
                <div key={item} className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Premier League pulse</h2>
            <div className="space-y-3">
              {(workspace?.news || []).slice(0, 3).map((item) => (
                <a key={item.id} href={item.link} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300 transition-colors hover:border-primary-500/30">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-2">{item.description}</p>
                </a>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">High-conviction names</h2>
            {priorityPlayers.length ? (
              <div className="space-y-4">
                {priorityPlayers.map((player) => (
                  <div key={player.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{player.name}</p>
                        <p className="mt-1 text-sm text-dark-400">
                          {player.position} · {player.club} · {player.marketValue}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">{player.goals} goals</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-dark-300">{player.scoutSummary}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">Add players and reports to surface high-conviction names here.</p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Upcoming visibility</h2>
            {(workspace?.matches || []).length ? (
              <div className="space-y-4">
                {workspace.matches.slice(0, 4).map((match) => (
                  <div key={match.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="font-semibold text-white">
                      {match.home} vs {match.away}
                    </p>
                    <p className="mt-1 text-sm text-dark-400">{new Date(match.date).toLocaleDateString("en-GB")}</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{match.venue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">No matches are stored yet.</p>
            )}
          </Card>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link to="/market" className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30">
            <p className="text-sm uppercase tracking-[0.18em] text-primary-400">Next view</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Open Market Intel</h3>
            <p className="mt-3 text-sm leading-relaxed text-dark-300">Follow the latest Premier League headlines and compare them with your own scouting base.</p>
          </Link>

          <Link to="/war-room" className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30">
            <p className="text-sm uppercase tracking-[0.18em] text-primary-400">Operator view</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Open Scout War Room</h3>
            <p className="mt-3 text-sm leading-relaxed text-dark-300">See what is missing, what is ready, and which live matches still need action.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Summary;
