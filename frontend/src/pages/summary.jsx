import React from "react";
import { Link } from "react-router-dom";
import { HiBadgeCheck, HiChartBar, HiLightningBolt, HiTrendingUp } from "react-icons/hi";
import Card from "../components/common/Card";
import { executiveSummary, sampleMatches, samplePlayers } from "../services/mockData";

const Summary = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Executive Summary</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">{executiveSummary.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-300">{executiveSummary.subtitle}</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {executiveSummary.headlineMetrics.map((metric, index) => (
            <Card key={metric.label} className="p-5">
              {index === 0 ? (
                <HiChartBar className="mb-3 h-5 w-5 text-primary-400" />
              ) : index === 1 ? (
                <HiBadgeCheck className="mb-3 h-5 w-5 text-primary-400" />
              ) : index === 2 ? (
                <HiTrendingUp className="mb-3 h-5 w-5 text-primary-400" />
              ) : (
                <HiLightningBolt className="mb-3 h-5 w-5 text-primary-400" />
              )}
              <p className="text-sm text-dark-400">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{metric.value}</p>
              <p className="mt-1 text-xs text-dark-500">{metric.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Market calls</h2>
            <div className="space-y-3">
              {executiveSummary.marketCalls.map((item) => (
                <div key={item} className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">Recommended actions</h2>
            <div className="space-y-3">
              {executiveSummary.recommendations.map((item) => (
                <div key={item} className="rounded-xl border border-white/5 bg-dark-900/50 p-4 text-sm leading-relaxed text-dark-300">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <h2 className="mb-5 text-xl font-bold text-white">High-conviction names</h2>
            <div className="space-y-4">
              {samplePlayers.slice(0, 4).map((player) => (
                <div key={player.id} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{player.name}</p>
                      <p className="mt-1 text-sm text-dark-400">
                        {player.position} - {player.club} - {player.marketValue}
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
            <h2 className="mb-5 text-xl font-bold text-white">Visibility this week</h2>
            <div className="space-y-4">
              {sampleMatches.map((match) => (
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

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link to="/market" className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30">
            <p className="text-sm uppercase tracking-[0.18em] text-primary-400">Next view</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Open Market Intel</h3>
            <p className="mt-3 text-sm leading-relaxed text-dark-300">
              Frame the recommendation set with demand concentration, regional value, and role pricing pressure.
            </p>
          </Link>

          <Link to="/war-room" className="glass-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/30">
            <p className="text-sm uppercase tracking-[0.18em] text-primary-400">Operator view</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Open Scout War Room</h3>
            <p className="mt-3 text-sm leading-relaxed text-dark-300">
              Show the workflow behind the conclusions: timelines, owners, active calls, and decision stages.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Summary;
