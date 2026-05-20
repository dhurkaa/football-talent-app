import React from "react";
import { motion } from "framer-motion";

const colors = {
  primary: "from-primary-500/20 to-emerald-500/20 border-primary-500/20 text-primary-400",
  blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-400",
  purple: "from-purple-500/20 to-pink-500/20 border-purple-500/20 text-purple-400",
  gold: "from-amber-500/20 to-yellow-500/20 border-amber-500/20 text-amber-400"
};

const StatCard = ({ icon: Icon, label, value, change, color = "primary", note }) => {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className={`rounded-2xl border bg-gradient-to-br ${colors[color]} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-dark-400">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change !== undefined ? (
            <p className={`mt-2 text-xs font-medium ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% from last month
            </p>
          ) : null}
          {note ? <p className="mt-2 text-xs text-dark-400">{note}</p> : null}
        </div>
        {Icon ? (
          <div className={`rounded-xl bg-gradient-to-br ${colors[color]} p-3`}>
            <Icon className="w-6 h-6" />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default StatCard;
