import React from "react";
import { HiArrowSmUp, HiChartBar, HiCurrencyDollar, HiGlobeAlt, HiTrendingUp } from "react-icons/hi";
import Card from "../components/common/Card";
import { marketIntel } from "../services/mockData";

const Market = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Market Intel</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Where demand is moving <span className="gradient-text">right now</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-dark-300">
            A recruiter-friendly view of role scarcity, pricing pressure, and which regions still offer real value.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {marketIntel.headlineMetrics.map((item, index) => (
            <Card key={item.label} className="p-5">
              {index === 0 ? (
                <HiTrendingUp className="mb-3 h-5 w-5 text-primary-400" />
              ) : index === 1 ? (
                <HiCurrencyDollar className="mb-3 h-5 w-5 text-primary-400" />
              ) : index === 2 ? (
                <HiChartBar className="mb-3 h-5 w-5 text-primary-400" />
              ) : (
                <HiArrowSmUp className="mb-3 h-5 w-5 text-primary-400" />
              )}
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-dark-500">{item.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiChartBar className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Role demand matrix</h2>
            </div>
            <div className="space-y-4">
              {marketIntel.demandMatrix.map((role) => (
                <div key={role.role} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{role.role}</p>
                      <p className="mt-1 text-sm text-dark-400">
                        {role.clubs} clubs active - {role.agePreference} preferred
                      </p>
                    </div>
                    <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">
                      {role.demand}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-white/5 bg-dark-950/60 p-3">
                      <p className="text-xs uppercase tracking-wider text-dark-400">Value band</p>
                      <p className="mt-2 text-sm font-semibold text-white">{role.valueBand}</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-dark-950/60 p-3">
                      <p className="text-xs uppercase tracking-wider text-dark-400">Takeaway</p>
                      <p className="mt-2 text-sm text-dark-300">{role.takeaway}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <HiGlobeAlt className="h-5 w-5 text-primary-400" />
              <h2 className="text-xl font-bold text-white">Regional pulse</h2>
            </div>
            <div className="space-y-4">
              {marketIntel.regionalPulse.map((region) => (
                <div key={region.region} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{region.region}</p>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-dark-300">{region.trend}</span>
                  </div>
                  <p className="mt-2 text-sm text-dark-400">{region.talentType}</p>
                  <p className="mt-3 text-sm text-white">{region.pricing}</p>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">{region.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <div className="mb-5 flex items-center gap-2">
            <HiTrendingUp className="h-5 w-5 text-primary-400" />
            <h2 className="text-xl font-bold text-white">Valuation watch</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {marketIntel.valuationWatch.map((item) => (
              <div key={item.player} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.player}</p>
                    <p className="mt-1 text-sm text-dark-400">{item.club}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.direction === "Up" ? "bg-amber-500/10 text-amber-300" : "bg-sky-500/10 text-sky-300"
                    }`}
                  >
                    {item.direction}
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold text-white">{item.current}</p>
                <p className="mt-2 text-sm leading-relaxed text-dark-300">{item.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Market;
