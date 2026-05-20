import React, { useMemo, useState } from "react";
import { HiGlobe, HiSearch, HiTrendingUp, HiUserGroup } from "react-icons/hi";
import Card from "../components/common/Card";
import { sampleClubs } from "../services/mockData";

const Clubs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClubs = useMemo(() => {
    return sampleClubs.filter((club) =>
      `${club.name} ${club.country} ${club.priorityNeed} ${club.league}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Club <span className="gradient-text">Directory</span>
          </h1>
          <p className="mt-2 text-dark-400">A recruitment-facing view of who is buying, what they need, and how they want to play.</p>
        </div>

        <div className="glass-card mb-8 p-6">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search clubs, leagues, countries, or priority roles..."
              className="input-field pl-12"
            />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Tracked clubs", value: sampleClubs.length, icon: HiUserGroup },
            { label: "Countries", value: new Set(sampleClubs.map((club) => club.country)).size, icon: HiGlobe },
            { label: "Open priority needs", value: sampleClubs.length, icon: HiTrendingUp }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{club.name}</h2>
                  <p className="mt-1 text-sm text-dark-400">
                    {club.league} - {club.country}
                  </p>
                </div>
                <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">{club.priorityNeed}</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Playing style", value: club.style },
                  { label: "Average age", value: club.squadAge },
                  { label: "Budget", value: club.budget },
                  { label: "Scouts", value: club.scouts }
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-dark-400">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-white/5 bg-dark-900/50 p-4">
                <p className="text-xs uppercase tracking-wider text-dark-400">Recruitment note</p>
                <p className="mt-2 text-sm leading-relaxed text-dark-300">{club.note}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
