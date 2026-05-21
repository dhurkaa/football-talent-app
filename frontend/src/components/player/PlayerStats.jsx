import React from "react";
import Card from "../common/Card";

const PlayerStats = ({ player }) => {
  const stats = [
    { label: "Appearances", value: player.matches || player.seasonStats?.appearances || 0 },
    { label: "Goals", value: player.goals || player.seasonStats?.goals || 0 },
    { label: "Assists", value: player.assists || player.seasonStats?.assists || 0 },
    { label: "Pass Accuracy", value: `${player.seasonStats?.passAccuracy || 0}%` },
    { label: "Minutes", value: player.seasonStats?.minutesPlayed || 0 },
    { label: "Shots On Target", value: player.seasonStats?.shotsOnTarget || 0 }
  ];

  return (
    <Card className="p-6">
      <h3 className="mb-5 text-xl font-bold text-white">Performance Snapshot</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
            <p className="text-xs uppercase tracking-wider text-dark-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PlayerStats;
