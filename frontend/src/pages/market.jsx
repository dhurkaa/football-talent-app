import React, { useEffect, useState } from "react";
import { HiChartBar, HiClipboardList, HiGlobeAlt, HiNewspaper, HiTrendingUp } from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { newsAPI, overviewAPI } from "../services/api";

const Market = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [newsResponse, workspaceResponse] = await Promise.all([
        newsAPI.getPremierLeagueLatest(),
        overviewAPI.getWorkspace()
      ]);
      setNews(newsResponse.data.items);
      setWorkspace(workspaceResponse.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading text="Loading market intel..." />;
  }

  const stats = workspace?.stats || {};

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Market Intel</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Real user data and <span className="gradient-text">live Premier League news</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-300">
            This page no longer runs on mock market narratives. It combines your workspace counts with the latest Premier League headlines from England.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Premier League headlines", value: news.length, icon: HiNewspaper, note: "Pulled live from BBC Sport's Premier League feed" },
            { label: "Players tracked", value: stats.playerCount || 0, icon: HiTrendingUp, note: "Stored under your account only" },
            { label: "Clubs tracked", value: stats.teamCount || 0, icon: HiChartBar, note: "Used for team-linked scouting" },
            { label: "Reports available", value: stats.reportCount || 0, icon: HiClipboardList, note: "Feeds the downstream decision views" }
          ].map((item) => (
            <Card key={item.label} className="p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-dark-500">{item.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiGlobeAlt className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Latest Premier League stories</h2>
            </div>
            {news.length ? (
              <div className="space-y-4">
                {news.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-white/5 bg-dark-900/50 p-4 transition-colors hover:border-primary-500/30"
                  >
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-dark-300">{item.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-dark-500">
                      {item.sourceName} · {new Date(item.publishedAt).toLocaleDateString("en-GB")}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">No live headlines are available right now.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiChartBar className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Workspace reality check</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                {stats.teamCount ? `You have ${stats.teamCount} club record${stats.teamCount === 1 ? "" : "s"} linked to your user.` : "You do not have any club records yet, so the player and match data model is still empty."}
              </div>
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                {stats.playerCount ? `Your player pool contains ${stats.playerCount} real record${stats.playerCount === 1 ? "" : "s"}.` : "There are no player records yet. This page will become more useful once you add real scouting targets."}
              </div>
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                {stats.reportCount ? `You already have ${stats.reportCount} report${stats.reportCount === 1 ? "" : "s"} to support actual recommendations.` : "You have not filed any scout reports yet, so the decision views cannot rank targets with confidence."}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Market;
