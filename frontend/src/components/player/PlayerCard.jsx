import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiEye, HiLocationMarker, HiStar } from "react-icons/hi";
import { GiSoccerBall } from "react-icons/gi";

const positionColors = {
  GK: "from-yellow-500 to-amber-500",
  DEF: "from-blue-500 to-cyan-500",
  MID: "from-green-500 to-emerald-500",
  FWD: "from-red-500 to-pink-500",
  ST: "from-red-500 to-orange-500",
  CM: "from-green-500 to-teal-500",
  CB: "from-blue-500 to-indigo-500",
  LW: "from-purple-500 to-pink-500",
  RW: "from-purple-500 to-violet-500"
};

const PlayerCard = ({ player, index = 0, compact = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link to={`/player/${player.id || player._id || index}`}>
        <div className={`glass-card relative overflow-hidden ${compact ? "p-4" : ""}`}>
          <div
            className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${
              positionColors[player.position] || "from-primary-500 to-emerald-500"
            }`}
          />

          <div className="absolute right-4 top-4 z-10">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-dark-900/80 px-2.5 py-1 backdrop-blur-sm">
              <HiStar className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-bold text-white">{player.rating ?? "-"}</span>
            </div>
          </div>

          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/25 to-transparent" />
            {player.image || player.avatar ? (
              <img
                src={player.image || player.avatar}
                alt={player.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary-500/30 bg-gradient-to-br from-primary-500/20 to-emerald-500/20">
                  <GiSoccerBall className="h-10 w-10 text-primary-400" />
                </div>
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white transition-colors group-hover:text-primary-300">{player.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <HiLocationMarker className="h-3.5 w-3.5 text-dark-400" />
                  <span className="text-xs text-dark-400">{player.nationality || player.location || "Unknown"}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-lg bg-gradient-to-r px-3 py-1 text-xs font-bold text-white ${
                  positionColors[player.position] || "from-primary-500 to-emerald-500"
                }`}
              >
                {player.position || "N/A"}
              </span>
              {player.age ? <span className="text-xs text-dark-400">Age <span className="font-medium text-white">{player.age}</span></span> : null}
              {player.club ? <span className="truncate text-xs text-dark-400">{player.club}</span> : null}
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{player.goals || 0}</p>
                <p className="text-[10px] uppercase tracking-wider text-dark-400">Goals</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{player.assists || 0}</p>
                <p className="text-[10px] uppercase tracking-wider text-dark-400">Assists</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{player.matches || 0}</p>
                <p className="text-[10px] uppercase tracking-wider text-dark-400">Matches</p>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-dark-900/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-semibold text-white">
                <HiEye className="h-5 w-5" />
                <span>View Profile</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PlayerCard;
