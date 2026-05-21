import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiCalendar,
  HiChartBar,
  HiClipboardList,
  HiGlobeAlt,
  HiLightningBolt,
  HiNewspaper,
  HiPencil,
  HiPlus,
  HiUserGroup
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import QuickStats from "../components/dashboard/QuickStats";
import Card from "../components/common/Card";
import { overviewAPI } from "../services/api";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Not scheduled";

const Dashboard = () => {
  const { user } = useAuth();
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

  const upcomingMatches = useMemo(() => {
    const matches = workspace?.matches || [];
    return matches
      .filter((match) => new Date(match.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [workspace]);

  const recentActivity = useMemo(() => {
    if (!workspace) {
      return [];
    }

    return [
      ...workspace.players.slice(0, 2).map((player) => ({
        id: `player-${player.id}`,
        label: "Player added",
        text: `${player.name} was added to your player pool.`,
        date: player.createdAt || null,
        icon: HiUserGroup
      })),
      ...workspace.reports.slice(0, 2).map((report) => ({
        id: `report-${report.id}`,
        label: "Report filed",
        text: `${report.author} logged a report on ${report.player}.`,
        date: report.date,
        icon: HiClipboardList
      })),
      ...workspace.matches.slice(0, 2).map((match) => ({
        id: `match-${match.id}`,
        label: "Match scheduled",
        text: `${match.home} vs ${match.away} is on your calendar.`,
        date: match.date,
        icon: HiCalendar
      }))
    ]
      .filter((item) => item.text)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5);
  }, [workspace]);

  if (loading) {
    return <Loading text="Loading your dashboard..." />;
  }

  const stats = workspace?.stats || {
    playerCount: 0,
    teamCount: 0,
    matchCount: 0,
    reportCount: 0
  };

  const quickStats = [
    { icon: HiUserGroup, label: "Tracked players", value: stats.playerCount, color: "primary", note: "Visible only inside your account" },
    { icon: HiChartBar, label: "Tracked clubs", value: stats.teamCount, color: "blue", note: "Each club record is owner-scoped" },
    { icon: HiCalendar, label: "Matches logged", value: stats.matchCount, color: "gold", note: "Upcoming and completed fixtures" },
    { icon: HiClipboardList, label: "Reports filed", value: stats.reportCount, color: "purple", note: "Saved to your personal workspace" }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Welcome back, <span className="gradient-text">{user?.name || "Scout"}</span>
            </h1>
            <p className="mt-2 text-dark-400">This workspace now shows only your own records plus live Premier League headlines.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/edit-profile" className="btn-secondary">
              <HiPencil className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
            <Link to="/players" className="btn-primary">
              <HiPlus className="h-4 w-4" />
              <span>Add Real Players</span>
            </Link>
          </div>
        </motion.div>

        <QuickStats stats={quickStats} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiLightningBolt className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Recent workspace activity</h2>
            </div>
            {recentActivity.length ? (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                        <item.icon className="h-5 w-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-sm text-dark-300">{item.text}</p>
                        <p className="mt-2 text-xs text-dark-500">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">No user-owned records yet. Start by creating teams, players, matches, or reports.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiCalendar className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Upcoming matches</h2>
            </div>
            {upcomingMatches.length ? (
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="font-semibold text-white">
                      {match.home} vs {match.away}
                    </p>
                    <p className="mt-1 text-sm text-dark-400">{formatDate(match.date)}</p>
                    <p className="mt-2 text-sm text-dark-300">{match.venue}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">No upcoming matches are stored in your account yet.</p>
            )}
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiGlobeAlt className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Premier League latest</h2>
            </div>
            {workspace?.news?.length ? (
              <div className="space-y-4">
                {workspace.news.slice(0, 4).map((item) => (
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
                      {item.sourceName} · {formatDate(item.publishedAt)}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-dark-400">The live Premier League feed is temporarily unavailable.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiNewspaper className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Next actions</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm text-dark-300">
                {stats.teamCount ? "Teams are in place. Add players against those teams so reports and matches stay linked correctly." : "Create at least one team first so players and matches can be assigned to a real club in your account."}
              </div>
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm text-dark-300">
                {stats.playerCount ? "Your player pool is live. Use reports and the watchlist to turn raw profiles into actual decisions." : "No players yet. Add real players instead of relying on seeded profiles."}
              </div>
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm text-dark-300">
                {stats.reportCount ? "Reports exist now, which means Summary, War Room, and Presentation can reflect real scouting work." : "Scout reports are still empty, so the downstream decision views will stay sparse until you log some evaluations."}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
