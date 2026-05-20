import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiBadgeCheck,
  HiChartBar,
  HiGlobe,
  HiLightningBolt,
  HiPlay,
  HiSearch,
  HiShieldCheck,
  HiUserGroup
} from "react-icons/hi";
import { GiSoccerBall, GiTrophy, GiWhistle } from "react-icons/gi";
import { presentationHighlights, sampleMatches, samplePlayers } from "../services/mockData";
import PlayerCard from "../components/player/PlayerCard";

const Home = () => {
  const stats = [
    { value: "10K+", label: "Active Players", icon: HiUserGroup },
    { value: "500+", label: "Professional Scouts", icon: HiSearch },
    { value: "50+", label: "Countries", icon: HiGlobe },
    { value: "1,200+", label: "Successful Transfers", icon: GiTrophy }
  ];

  const features = [
    {
      icon: HiLightningBolt,
      title: "AI-Powered Matching",
      description: "Rank players, clubs, and scout demand around profile fit, current output, and long-term upside.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: HiChartBar,
      title: "Advanced Analytics",
      description: "Track contribution, role suitability, and form using clean scouting dashboards instead of scattered spreadsheets.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: HiPlay,
      title: "Video Highlights",
      description: "Pin key sequences and performance clips next to the stats that explain why they matter.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: HiShieldCheck,
      title: "Verified Profiles",
      description: "Separate signal from noise with identity checks, organized records, and structured player information.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: GiWhistle,
      title: "Live Scouting",
      description: "Coordinate match coverage, attendance, and notes with a fast, shared scouting workflow.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: HiGlobe,
      title: "Global Network",
      description: "Surface talent across academies, leagues, and markets without losing context on readiness and fit.",
      color: "from-indigo-500 to-violet-500"
    }
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-hero-pattern bg-grid-lg opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_40%)]" />
        <div className="page-container relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2"
              >
                <span className="h-2 w-2 rounded-full bg-primary-400" />
                <span className="text-sm font-medium text-primary-200">High-signal football scouting workspace</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-balance font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
              >
                FootballTalent for
                <span className="gradient-text"> discovery that actually ships decisions</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-dark-300"
              >
                One place to showcase talent, compare performance, shortlist targets, and move from raw interest to real scouting action.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <Link to="/register" className="btn-primary px-8 py-4 text-lg">
                  <span>Start Your Journey</span>
                  <HiArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/players" className="btn-secondary px-8 py-4 text-lg">
                  <HiSearch className="h-5 w-5" />
                  <span>Browse Talent</span>
                </Link>
              </motion.div>

              <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass-card p-5">
                    <stat.icon className="mb-2 h-5 w-5 text-primary-400" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-dark-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card overflow-hidden p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-dark-400">Live Board</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Featured prospects</h2>
                </div>
                <div className="rounded-xl border border-primary-500/20 bg-primary-500/10 px-3 py-2 text-sm text-primary-300">
                  Updated today
                </div>
              </div>
              <div className="space-y-4">
                {samplePlayers.slice(0, 3).map((player) => (
                  <div key={player.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-dark-900/70 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/15 to-emerald-500/15">
                        <GiSoccerBall className="h-6 w-6 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{player.name}</p>
                        <p className="text-sm text-dark-400">{player.position} - {player.club}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{player.rating}</p>
                      <p className="text-xs text-dark-400">rating</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="page-container">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Top Profiles</p>
              <h2 className="mt-3 font-display text-4xl font-bold text-white">A sharper player marketplace</h2>
            </div>
            <Link to="/players" className="hidden text-sm font-medium text-primary-300 hover:text-primary-200 sm:inline-flex">
              View all players
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {samplePlayers.slice(0, 3).map((player, index) => (
              <PlayerCard key={player.id} player={player} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/5 bg-dark-900/20">
        <div className="page-container">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-card p-8">
              <div className="mb-6 flex items-center gap-2">
                <HiBadgeCheck className="h-5 w-5 text-primary-400" />
                <h2 className="text-2xl font-bold text-white">Demo-ready talking points</h2>
              </div>
              <div className="space-y-3">
                {presentationHighlights.map((item) => (
                  <div key={item} className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-dark-400">Upcoming Showcase</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">Fixtures that matter this week</h2>
                </div>
                <Link to="/matches" className="text-sm font-medium text-primary-300 hover:text-primary-200">
                  Match center
                </Link>
              </div>
              <div className="space-y-4">
                {sampleMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="rounded-2xl border border-white/5 bg-dark-900/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">
                        {match.home} vs {match.away}
                      </p>
                      <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">{match.scouts} scouts</span>
                    </div>
                    <p className="mt-2 text-sm text-dark-400">{match.competition}</p>
                    <p className="mt-3 text-sm leading-relaxed text-dark-300">{match.storyline}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="page-container">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Executive Summary",
                text: "A boardroom-ready view of market movement, priority names, and action items.",
                link: "/summary"
              },
              {
                title: "Market Intel",
                text: "Role demand, regional opportunity, and pricing pressure in one recruiter-friendly surface.",
                link: "/market"
              },
              {
                title: "Shortlist Board",
                text: "Role-based lists with owners, urgency, and player groups tied to real objectives.",
                link: "/shortlist"
              },
              {
                title: "Presentation Mode",
                text: "A clean story flow for walking the room through the platform tomorrow.",
                link: "/presentation"
              },
              {
                title: "Scout War Room",
                text: "The live operating view for pending decisions, fixture handoffs, and next actions.",
                link: "/war-room"
              }
            ].map((item) => (
              <Link key={item.title} to={item.link} className="glass-card block p-8 transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-1">
                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dark-300">{item.text}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-primary-300">Open view</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding border-y border-white/5 bg-dark-900/30">
        <div className="page-container">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Why Teams Use It</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-white">Built for serious football operations</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-dark-400">
              Clean interfaces, fast comparison workflows, and enough depth to support real scouting without turning the product into a maze.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-8">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-dark-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="page-container">
          <div className="glass-card p-10 sm:p-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <GiSoccerBall className="mb-5 h-14 w-14 text-primary-400" />
                <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
                  Ready to get <span className="gradient-text">discovered?</span>
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-dark-300">
                  Launch a profile, share clips, and give scouts enough context to say yes faster.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Link to="/register" className="btn-primary px-8 py-4">
                  Create Free Account
                </Link>
                <Link to="/about" className="btn-outline px-8 py-4">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
