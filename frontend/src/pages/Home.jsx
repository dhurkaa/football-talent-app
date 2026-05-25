import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiGlobe,
  HiLightningBolt,
  HiLockClosed,
  HiSearch,
  HiShieldCheck
} from "react-icons/hi";
import { GiSoccerBall } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { newsAPI } from "../services/api";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      if (!isAuthenticated) {
        setNews([]);
        return;
      }

      const response = await newsAPI.getPremierLeagueLatest();
      setNews(response.data.items);
    };

    fetchNews();
  }, [isAuthenticated]);

  const productPoints = [
    { title: "Private workspace", description: "Every stored team, player, match, scout, and report stays scoped to the logged-in user.", icon: HiLockClosed },
    { title: "AI scouting lab", description: "Drill scoring, similarity search, highlight generation, talent alerts, and export packs now live in one workspace.", icon: HiLightningBolt },
    { title: "Live Premier League feed", description: "Latest headlines come from a real BBC Sport Premier League feed instead of seeded demo cards.", icon: HiGlobe },
    { title: "Scouting-ready structure", description: "Players, matches, and reports are linked so the downstream views can stay honest.", icon: HiShieldCheck },
    { title: "No demo fallbacks", description: "Signed-in pages now render empty states when your data is missing instead of inventing sample output.", icon: HiSearch }
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-hero-pattern bg-grid-lg opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_40%)]" />
        <div className="page-container relative py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-primary-400" />
                <span className="text-sm font-medium text-primary-200">Real data workspace for football scouting</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-balance font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
              >
                FootballTalent for
                <span className="gradient-text"> scouting that stays honest</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-dark-300"
              >
                Store your own clubs, players, matches, reports, and watchlist entries, then layer in the latest Premier League news from England without relying on mock records.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-primary px-8 py-4 text-lg">
                  <span>{isAuthenticated ? "Open Dashboard" : "Create Account"}</span>
                  <HiArrowRight className="h-5 w-5" />
                </Link>
                <Link to={isAuthenticated ? "/ai-lab" : "/login"} className="btn-secondary px-8 py-4 text-lg">
                  <HiSearch className="h-5 w-5" />
                  <span>{isAuthenticated ? "Open AI Lab" : "Sign In"}</span>
                </Link>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="glass-card overflow-hidden p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-dark-400">Workspace Principles</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">No fake records</h2>
                </div>
                <div className="rounded-xl border border-primary-500/20 bg-primary-500/10 px-3 py-2 text-sm text-primary-300">
                  Updated now
                </div>
              </div>
              <div className="space-y-4">
                {productPoints.map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-dark-900/70 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/15 to-emerald-500/15">
                      <item.icon className="h-6 w-6 text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm text-dark-300">{item.description}</p>
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
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Live Feed</p>
              <h2 className="mt-3 font-display text-4xl font-bold text-white">Premier League headlines</h2>
            </div>
          </div>

          {isAuthenticated && news.length ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {news.slice(0, 3).map((item) => (
                <a key={item.id} href={item.link} target="_blank" rel="noreferrer" className="glass-card block p-8 transition-all duration-300 hover:border-primary-500/30 hover:-translate-y-1">
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-dark-300">{item.description}</p>
                  <span className="mt-5 inline-flex text-sm font-semibold text-primary-300">Open article</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="glass-card p-8">
              <p className="text-sm text-dark-300">
                {isAuthenticated
                  ? "The live Premier League feed is temporarily unavailable."
                  : "Sign in to load the live Premier League news feed on this page."}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding border-y border-white/5 bg-dark-900/30">
        <div className="page-container">
          <div className="glass-card p-10 sm:p-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <GiSoccerBall className="mb-5 h-14 w-14 text-primary-400" />
                <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
                  Build your own <span className="gradient-text">scouting record</span>
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-dark-300">
                  Start with teams, add players, link matches, write reports, and keep your watchlist inside one user-owned workspace.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Link to={isAuthenticated ? "/players" : "/register"} className="btn-primary px-8 py-4">
                  {isAuthenticated ? "Open Players" : "Create Free Account"}
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
