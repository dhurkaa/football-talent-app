import React from "react";
import { HiClipboardList, HiSparkles, HiUserGroup } from "react-icons/hi";
import Card from "../components/common/Card";
import { samplePlayers, shortlistBoard } from "../services/mockData";

const Shortlist = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Shortlist <span className="gradient-text">Board</span>
          </h1>
          <p className="mt-2 text-dark-400">A practical recruiting surface for priority lists, owners, urgency, and next-action context.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Active lists", value: shortlistBoard.length, icon: HiClipboardList },
            { label: "Players inside lists", value: shortlistBoard.reduce((sum, list) => sum + list.players.length, 0), icon: HiUserGroup },
            { label: "High urgency lists", value: shortlistBoard.filter((list) => list.urgency === "High").length, icon: HiSparkles }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {shortlistBoard.map((list) => (
            <Card key={list.id} className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">{list.list}</h2>
                  <p className="mt-1 text-sm text-dark-400">{list.owner}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    list.urgency === "High" ? "bg-red-500/10 text-red-300" : "bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {list.urgency}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-dark-300">{list.objective}</p>

              <div className="mt-5 space-y-3">
                {list.players.map((playerName) => {
                  const player = samplePlayers.find((item) => item.name === playerName);
                  return (
                    <div key={playerName} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{player?.name || playerName}</p>
                          <p className="mt-1 text-xs text-dark-400">
                            {player?.position} - {player?.club}
                          </p>
                        </div>
                        <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">{player?.rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shortlist;
