import React, { useEffect, useState } from "react";
import { HiClipboardList, HiEye, HiSparkles, HiTrendingUp, HiUserGroup } from "react-icons/hi";
import Card from "../components/common/Card";
import QuickStats from "../components/dashboard/QuickStats";
import PlayerCard from "../components/player/PlayerCard";
import Loading from "../components/common/Loading";
import { scoutAPI } from "../services/api";
import { sampleMatches } from "../services/mockData";

const ScoutDashboard = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [watchlistResponse, recommendationResponse] = await Promise.all([
        scoutAPI.getWatchlist(),
        scoutAPI.getRecommendations()
      ]);

      setWatchlist(watchlistResponse.data);
      setRecommendations(recommendationResponse.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading text="Building your scout workspace..." />;
  }

  const stats = [
    { icon: HiClipboardList, label: "Active Shortlists", value: "8", change: 14, color: "primary" },
    { icon: HiUserGroup, label: "Tracked Players", value: String(watchlist.length), change: 9, color: "blue" },
    { icon: HiEye, label: "Live Match Coverage", value: "3", change: 0, color: "gold" },
    { icon: HiSparkles, label: "AI Recommendations", value: String(recommendations.length), change: 22, color: "purple" }
  ];

  const priorityFixtures = sampleMatches.slice(0, 3);

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Scout <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="mt-2 text-dark-400">Prioritize targets, review live coverage, and keep your shortlist moving.</p>
        </div>

        <QuickStats stats={stats} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Recommendation Themes</h2>
            <div className="space-y-4">
              {recommendations.map((item) => (
                <div key={item.name} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-dark-400">{item.clubs} clubs currently searching in this segment.</p>
                      <p className="mt-2 text-xs text-dark-500">{item.note}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">{item.openRoles} open roles</span>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.urgency === "High" ? "bg-red-500/10 text-red-300" : "bg-amber-500/10 text-amber-300"}`}>
                        {item.urgency} urgency
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Watchlist</h2>
              <button className="text-sm text-primary-300 hover:text-primary-200">Manage list</button>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {watchlist.map((player, index) => (
                <PlayerCard key={player.id} player={player} index={index} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiTrendingUp className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Priority Fixtures</h2>
            </div>
            <div className="space-y-4">
              {priorityFixtures.map((match) => (
                <div key={match.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">
                        {match.home} vs {match.away}
                      </p>
                      <p className="mt-1 text-sm text-dark-400">{match.competition} · {new Date(match.date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">{match.scouts} scouts</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dark-300">{match.storyline}</p>
                  <p className="mt-2 text-xs text-dark-500">Featured prospects: {match.featuredProspects.join(", ")}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiSparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Demo Talking Points</h2>
            </div>
            <div className="space-y-3">
              {[
                "Shortlists now carry context around urgency, role demand, and market pricing pressure.",
                "Each fixture highlights which prospects matter and why scouts are attending.",
                "Watchlist players can anchor a full recruitment story from first look to fit assessment."
              ].map((item) => (
                <div key={item} className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScoutDashboard;
