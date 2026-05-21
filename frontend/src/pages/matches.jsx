import React, { useEffect, useMemo, useState } from "react";
import { HiLocationMarker, HiPlay, HiUserGroup } from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { matchAPI } from "../services/api";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const response = await matchAPI.getAll();
      setMatches(response.data);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  const summary = useMemo(() => {
    const liveCount = matches.filter((match) => match.status === "scheduled").length;
    const totalScouts = matches.reduce((sum, match) => sum + (match.scouts || 0), 0);
    return {
      liveCount,
      totalScouts,
      featuredProspects: matches.reduce((sum, match) => sum + ((match.featuredProspects || []).length || 0), 0)
    };
  }, [matches]);

  if (loading) {
    return <Loading text="Loading matches..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Match <span className="gradient-text">Center</span>
          </h1>
          <p className="mt-2 text-dark-400">Track upcoming fixtures, live scouting coverage, and where attention is clustering.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Scheduled fixtures", value: summary.liveCount },
            { label: "Scouts assigned", value: summary.totalScouts },
            { label: "Featured prospects", value: summary.featuredProspects }
          ].map((item) => (
            <div key={item.label} className="glass-card p-5">
              <p className="text-sm text-dark-400">{item.label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {matches.map((match) => (
            <Card key={match.id} className="p-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-300">{match.status}</span>
                    {match.competition ? <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-dark-300">{match.competition}</span> : null}
                    <span className="text-sm text-dark-400">{new Date(match.date).toLocaleDateString()}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-white">
                    {match.home} <span className="text-dark-500">vs</span> {match.away}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-dark-400">
                    <span className="inline-flex items-center gap-2">
                      <HiLocationMarker className="h-4 w-4 text-primary-400" />
                      <span>{match.venue}</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <HiUserGroup className="h-4 w-4 text-primary-400" />
                      <span>{match.scouts} scouts attending</span>
                    </span>
                  </div>
                  {match.storyline ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-dark-300">{match.storyline}</p> : null}
                  {match.featuredProspects?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {match.featuredProspects.map((player) => (
                        <span key={player} className="rounded-full border border-white/10 bg-dark-900/60 px-3 py-1 text-xs font-medium text-dark-200">
                          {player}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="rounded-2xl border border-white/5 bg-dark-900/50 px-5 py-4 text-center">
                  <p className="text-xs uppercase tracking-wider text-dark-400">Kickoff</p>
                  <p className="mt-2 text-lg font-bold text-white">{new Date(match.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  {match.broadcast ? <p className="mt-2 text-xs text-dark-500">{match.broadcast}</p> : null}
                </div>
                <button className="btn-secondary">
                  <HiPlay className="h-4 w-4" />
                  <span>Open Match Card</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matches;
