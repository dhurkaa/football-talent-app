import React, { useEffect, useMemo, useState } from "react";
import { HiGlobe, HiSearch, HiTrendingUp, HiUserGroup } from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { teamAPI } from "../services/api";

const Clubs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await teamAPI.getAll();
      setTeams(response.data);
      setLoading(false);
    };

    fetchTeams();
  }, []);

  const filteredClubs = useMemo(() => {
    return teams.filter((club) =>
      `${club.name} ${club.city} ${club.coachName} ${club.leagueName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, teams]);

  if (loading) {
    return <Loading text="Loading clubs..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Club <span className="gradient-text">Directory</span>
          </h1>
          <p className="mt-2 text-dark-400">These clubs come from the signed-in user's stored team records only.</p>
        </div>

        <div className="glass-card mb-8 p-6">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search clubs, cities, coaches, or leagues..."
              className="input-field pl-12"
            />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Tracked clubs", value: teams.length, icon: HiUserGroup },
            { label: "Cities covered", value: new Set(teams.map((club) => club.city)).size, icon: HiGlobe },
            { label: "With squad info", value: teams.filter((club) => club.squadSize > 0).length, icon: HiTrendingUp }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <item.icon className="mb-3 h-5 w-5 text-primary-400" />
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {filteredClubs.length ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {filteredClubs.map((club) => (
              <Card key={club.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{club.name}</h2>
                    <p className="mt-1 text-sm text-dark-400">
                      {club.leagueName} · {club.city}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">{club.coachName}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { label: "Founded", value: club.foundedYear || "Not set" },
                    { label: "Squad size", value: club.squadSize || 0 },
                    { label: "Average age", value: club.averageAge || "Not set" },
                    { label: "Stadium", value: club.stadium }
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                      <p className="text-xs uppercase tracking-wider text-dark-400">{item.label}</p>
                      <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-dark-400">Source note</p>
                  <p className="mt-2 text-sm leading-relaxed text-dark-300">{club.note}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <p className="text-sm text-dark-400">No clubs match this search yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Clubs;
