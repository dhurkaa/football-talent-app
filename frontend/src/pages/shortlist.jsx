import React, { useEffect, useMemo, useState } from "react";
import { HiClipboardList, HiSparkles, HiUserGroup } from "react-icons/hi";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { overviewAPI } from "../services/api";
import { shortlistBoard as mockShortlistBoard } from "../services/mockData";

const Shortlist = () => {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const response = await overviewAPI.getWorkspace();
      setPlayers(response.data.players);
      setLoading(false);
    };

    fetchWorkspace();
  }, []);

  const shortlistBoard = useMemo(() => {
    const playerMap = new Map(players.map((player) => [player.name, player]));
    const curatedLists = mockShortlistBoard
      .map((list) => ({
        ...list,
        players: list.players.map((name) => playerMap.get(name)).filter(Boolean)
      }))
      .filter((list) => list.players.length);

    const topScorers = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 4);
    const youngProspects = players.filter((player) => typeof player.age === "number" && player.age <= 21).slice(0, 4);

    const dynamicLists = [
      {
        id: "scorers",
        list: "Scoring Threats",
        owner: "Auto-built from player output",
        urgency: topScorers.length ? "High" : "Low",
        objective: "Players with the strongest goal output in the current scouting pool.",
        players: topScorers
      },
      {
        id: "prospects",
        list: "Young Prospects",
        owner: "Auto-built from age and upside",
        urgency: youngProspects.length ? "Medium" : "Low",
        objective: "High-upside U21 profiles worth continued tracking.",
        players: youngProspects
      }
    ].filter((list) => list.players.length);

    return [...curatedLists, ...dynamicLists];
  }, [players]);

  if (loading) {
    return <Loading text="Loading shortlist board..." />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-white">
            Shortlist <span className="gradient-text">Board</span>
          </h1>
          <p className="mt-2 text-dark-400">
            This board now mixes curated scouting lists with live-derived groups, so it remains useful even before your
            own recruitment workflow is fully built out.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Active lists", value: shortlistBoard.length, icon: HiClipboardList },
            { label: "Players included", value: shortlistBoard.reduce((sum, list) => sum + list.players.length, 0), icon: HiUserGroup },
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
                {list.players.map((player) => (
                  <div key={`${list.id}-${player.id}`} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{player.name}</p>
                        <p className="mt-1 text-xs text-dark-400">
                          {player.position} - {player.club}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary-500/10 px-2.5 py-1 text-xs font-semibold text-primary-300">
                        {player.goals ? `${player.goals} G` : `${player.matches} MP`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shortlist;
