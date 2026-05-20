import React from "react";
import { HiBadgeCheck, HiClock, HiPlay, HiPresentationChartBar } from "react-icons/hi";
import Card from "../components/common/Card";
import { presentationAgenda, sampleMatches, samplePlayers, scoutReports } from "../services/mockData";

const Presentation = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Presentation Mode</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">A clean walkthrough for tomorrow's room</h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-300">
            This page is tuned for storytelling: what the market looks like, who matters most, and how the scouting workflow supports the decision.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { label: "Agenda steps", value: presentationAgenda.length, icon: HiPresentationChartBar },
            { label: "Featured prospects", value: 4, icon: HiBadgeCheck },
            { label: "Priority reports", value: scoutReports.length, icon: HiPlay },
            { label: "Demo length", value: "7 min", icon: HiClock }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Walkthrough agenda</h2>
            <div className="space-y-4">
              {presentationAgenda.map((item, index) => (
                <div key={item.step} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-sm font-bold text-white">{index + 1}</div>
                    <p className="font-semibold text-white">{item.step}</p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dark-300">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="mb-5 text-xl font-bold text-white">Open with these players</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {samplePlayers.slice(0, 4).map((player) => (
                  <div key={player.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{player.name}</p>
                        <p className="mt-1 text-xs text-dark-400">
                          {player.position} - {player.marketValue}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">{player.rating}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-dark-300">{player.scoutSummary}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-5 text-xl font-bold text-white">Anchor match storylines</h2>
              <div className="space-y-4">
                {sampleMatches.slice(0, 3).map((match) => (
                  <div key={match.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="font-semibold text-white">
                      {match.home} vs {match.away}
                    </p>
                    <p className="mt-1 text-sm text-dark-400">{match.competition}</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-300">{match.storyline}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation;
