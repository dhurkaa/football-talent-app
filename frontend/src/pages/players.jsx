import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HiSearch, HiSparkles, HiTrendingUp, HiViewGrid, HiViewList, HiX } from "react-icons/hi";
import Loading from "../components/common/Loading";
import PlayerCard from "../components/player/PlayerCard";
import { playerAPI } from "../services/api";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [sortBy, setSortBy] = useState("goals");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await playerAPI.getAll();
      setPlayers(response.data);
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  const positions = ["all", "GK", "DEF", "CB", "MID", "CM", "FWD", "ST", "LW", "RW"];

  const filteredPlayers = useMemo(() => {
    return [...players]
      .filter((player) => {
        const haystack = `${player.name} ${player.nationality || ""} ${player.club || ""}`.toLowerCase();
        const matchesSearch = haystack.includes(searchQuery.toLowerCase());
        const matchesPosition = selectedPosition === "all" || player.position === selectedPosition;
        return matchesSearch && matchesPosition;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "goals") return (b.goals || 0) - (a.goals || 0);
        if (sortBy === "age") return (a.age || 0) - (b.age || 0);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [players, searchQuery, selectedPosition, sortBy]);

  const topScorers = useMemo(() => [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 3), [players]);

  if (loading) {
    return <Loading text="Discovering talent..." />;
  }

  const averageAge = players.length
    ? (players.reduce((sum, player) => sum + (player.age || 0), 0) / players.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Discover <span className="gradient-text">Talent</span>
          </h1>
          <p className="mt-2 text-lg text-dark-400">Browse verified players from around the world and sort for fit, output, or upside.</p>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            { label: "Verified player pool", value: players.length, icon: HiSparkles, note: "Real records stored in your workspace" },
            { label: "Average age", value: averageAge, icon: HiTrendingUp, note: "Across your current player pool" },
            { label: "Top scorer", value: topScorers[0]?.name || "-", icon: HiSparkles, note: `${topScorers[0]?.goals || 0} goals this season` }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-dark-500">{item.note}</p>
            </div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card mb-8 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <HiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, nationality, or club..."
                className="input-field pl-12"
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                  <HiX className="h-5 w-5" />
                </button>
              ) : null}
            </div>

            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="input-field w-full lg:w-48">
              <option value="goals">Sort by Goals</option>
              <option value="age">Sort by Age</option>
              <option value="name">Sort by Name</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-xl p-3 ${viewMode === "grid" ? "border border-primary-500/30 bg-primary-500/20 text-primary-300" : "glass text-dark-400 hover:text-white"}`}
              >
                <HiViewGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-xl p-3 ${viewMode === "list" ? "border border-primary-500/30 bg-primary-500/20 text-primary-300" : "glass text-dark-400 hover:text-white"}`}
              >
                <HiViewList className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-4">
            {positions.map((position) => (
              <button
                key={position}
                onClick={() => setSelectedPosition(position)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedPosition === position
                    ? "bg-primary-500 text-white shadow-glow-green"
                    : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white"
                }`}
              >
                {position === "all" ? "All Positions" : position}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-dark-400">
            Showing <span className="font-semibold text-white">{filteredPlayers.length}</span> players
          </p>
          {searchQuery || selectedPosition !== "all" ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedPosition("all");
              }}
              className="flex items-center gap-1 text-sm text-primary-300 hover:text-primary-200"
            >
              <HiX className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          ) : null}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-dark-900/50 p-5">
            <div className="mb-4 flex items-center gap-2">
              <HiTrendingUp className="h-5 w-5 text-primary-400" />
              <h2 className="text-lg font-bold text-white">Trending now</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {topScorers.map((player) => (
                <div key={player.id} className="rounded-xl border border-white/5 bg-dark-950/60 p-4">
                  <p className="font-semibold text-white">{player.name}</p>
                  <p className="mt-1 text-xs text-dark-400">
                    {player.position} - {player.club}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-white">{player.goals}</p>
                  <p className="text-xs uppercase tracking-wider text-dark-500">Goals</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-dark-900/50 p-5">
            <div className="mb-4 flex items-center gap-2">
              <HiSparkles className="h-5 w-5 text-primary-400" />
              <h2 className="text-lg font-bold text-white">Scout lens</h2>
            </div>
            <div className="space-y-3">
              {[
                "This list is now driven by your stored player records only.",
                "Use goals, appearances, and scouting reports to separate current output from upside.",
                "Add reports and matches next if you want the downstream decision pages to become richer."
              ].map((item) => (
                <div key={item} className="rounded-xl border border-white/5 bg-dark-950/60 p-4 text-sm leading-relaxed text-dark-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPlayers.length ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filteredPlayers.map((player, index) => (
              <PlayerCard key={player.id} player={player} index={index} compact={viewMode === "list"} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <HiSearch className="mx-auto mb-4 h-16 w-16 text-dark-600" />
            <h3 className="text-xl font-semibold text-white">No players found</h3>
            <p className="mt-2 text-dark-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
