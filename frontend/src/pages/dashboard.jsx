import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiBadgeCheck,
  HiCalendar,
  HiChartBar,
  HiEye,
  HiGlobeAlt,
  HiLightningBolt,
  HiPencil,
  HiPresentationChartBar,
  HiPlus,
  HiSparkles,
  HiStar,
  HiTrendingUp,
  HiUserGroup
} from "react-icons/hi";
import { GiSoccerBall, GiTrophy } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import QuickStats from "../components/dashboard/QuickStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import Card from "../components/common/Card";
import { dashboardActivity, presentationHighlights, sampleMatches, showcaseInsights } from "../services/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading text="Loading your dashboard..." />;
  }

  const playerStats = [
    { icon: HiEye, label: "Profile Views", value: "2,847", change: 12, color: "primary" },
    { icon: HiStar, label: "Overall Rating", value: "8.5", change: 3, color: "gold" },
    { icon: HiUserGroup, label: "Scout Interest", value: "23", change: 8, color: "blue" },
    { icon: GiTrophy, label: "Achievements", value: "12", change: 5, color: "purple" }
  ];

  const recentActivity = dashboardActivity.map((item) => ({
    ...item,
    icon:
      item.type === "view"
        ? HiEye
        : item.type === "rating"
        ? HiStar
        : item.type === "match"
        ? GiSoccerBall
        : item.type === "scout"
        ? HiUserGroup
        : HiSparkles
  }));

  const upcomingMatches = sampleMatches.slice(0, 3).map((match, index) => ({
    opponent: index % 2 === 0 ? match.away : match.home,
    date: new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    venue: index % 2 === 0 ? "Home" : "Away",
    storyline: match.storyline
  }));

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Welcome back, <span className="gradient-text">{user?.name || "Player"}</span>
            </h1>
            <p className="mt-2 text-dark-400">Here is the latest on your profile, interest, and upcoming work.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/edit-profile" className="btn-secondary">
              <HiPencil className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
            <Link to="/players" className="btn-primary">
              <HiPlus className="h-4 w-4" />
              <span>Explore Talent</span>
            </Link>
          </div>
        </motion.div>

        <QuickStats stats={playerStats} />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity title="Recent Activity" items={recentActivity} />
          </div>

          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <HiCalendar className="h-5 w-5 text-primary-400" />
                <span>Upcoming</span>
              </h2>
              <Link to="/matches" className="text-sm text-primary-300 hover:text-primary-200">
                All Matches
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <div key={`${match.opponent}-${match.date}`} className="rounded-xl border border-white/5 bg-dark-900/50 p-4 transition-all duration-300 hover:border-primary-500/20">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{match.opponent}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${match.venue === "Home" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
                      {match.venue}
                    </span>
                  </div>
                  <p className="text-xs text-dark-400">{match.date}</p>
                  <p className="mt-2 text-xs leading-relaxed text-dark-500">{match.storyline}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiTrendingUp className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Market Snapshot</h2>
            </div>
            <div className="space-y-4">
              {showcaseInsights.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-dark-400">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
                    </div>
                    <HiBadgeCheck className="h-5 w-5 text-primary-400" />
                  </div>
                  <p className="mt-2 text-sm text-dark-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiSparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Presentation Highlights</h2>
            </div>
            <div className="space-y-3">
              {presentationHighlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-400" />
                  <p className="text-sm leading-relaxed text-dark-300">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Upload Highlights", icon: HiPlus, color: "from-green-500 to-emerald-500", link: "/edit-profile" },
            { label: "Executive Summary", icon: HiBadgeCheck, color: "from-blue-500 to-cyan-500", link: "/summary" },
            { label: "Market Intel", icon: HiGlobeAlt, color: "from-purple-500 to-pink-500", link: "/market" },
            { label: "War Room", icon: HiLightningBolt, color: "from-amber-500 to-orange-500", link: "/war-room" },
            { label: "Presentation Mode", icon: HiPresentationChartBar, color: "from-rose-500 to-orange-500", link: "/presentation" }
          ].map((action) => (
            <Link key={action.label} to={action.link} className="glass-card group p-5 transition-all duration-300 hover:border-primary-500/30">
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-white transition-colors group-hover:text-primary-300">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
