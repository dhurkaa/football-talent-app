import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiCalendar,
  HiHeart,
  HiLocationMarker,
  HiMail,
  HiPlay,
  HiShare,
  HiStar,
  HiTrendingUp
} from "react-icons/hi";
import { GiSoccerBall, GiRunningShoe, GiTrophy } from "react-icons/gi";
import Loading from "../components/common/Loading";
import Card from "../components/common/Card";
import SkillRadar from "../components/player/SkillRadar";
import PlayerStats from "../components/player/PlayerStats";
import { playerAPI, scoutAPI } from "../services/api";

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      const response = await playerAPI.getById(id);
      setPlayer(response.data);
      setLoading(false);
    };

    fetchPlayer();
  }, [id]);

  const seasonStats = useMemo(
    () =>
      player?.seasonStats || {
        appearances: player?.matches || 34,
        goals: player?.goals || 0,
        assists: player?.assists || 0,
        yellowCards: 3,
        redCards: 0,
        minutesPlayed: 2890,
        passAccuracy: 82,
        shotsOnTarget: 67
      },
    [player]
  );

  if (loading) {
    return <Loading text="Loading player profile..." />;
  }

  if (!player) {
    return <div className="py-20 text-center text-dark-400">Player not found.</div>;
  }

  const tabs = ["overview", "stats", "highlights", "achievements"];

  const handleWatchlist = async () => {
    setLiked((current) => !current);
    if (!liked) {
      await scoutAPI.addToWatchlist(player.id);
      toast.success(`${player.name} added to watchlist.`);
    } else {
      await scoutAPI.removeFromWatchlist(player.id);
      toast.success(`${player.name} removed from watchlist.`);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/players" className="inline-flex items-center gap-2 text-dark-400 hover:text-white">
            <HiArrowLeft className="h-5 w-5" />
            <span>Back to Players</span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="glass-card mb-8 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-emerald-500/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

            <div className="relative p-8 sm:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-emerald-500 shadow-glow-green sm:h-40 sm:w-40">
                    <GiSoccerBall className="h-16 w-16 text-white sm:h-20 sm:w-20" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-4 border-dark-900 bg-amber-500">
                    <span className="text-sm font-bold text-white">{player.rating ?? "-"}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{player.name}</h1>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-dark-300">
                        <span className="inline-flex items-center gap-1">
                          <HiLocationMarker className="h-4 w-4 text-primary-400" />
                          <span>{player.nationality}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <HiCalendar className="h-4 w-4 text-primary-400" />
                          <span>Age {player.age}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <GiSoccerBall className="h-4 w-4 text-primary-400" />
                          <span>{player.club}</span>
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <span className="rounded-lg bg-gradient-to-r from-primary-500 to-emerald-500 px-4 py-1.5 text-sm font-bold text-white">
                          {player.position}
                        </span>
                        <span className="rounded-lg border border-white/10 bg-dark-900/60 px-4 py-1.5 text-sm text-dark-300">{player.marketValue}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleWatchlist}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                          liked ? "bg-red-500/15 text-red-300 border border-red-500/20" : "btn-secondary"
                        }`}
                      >
                        <HiHeart className="h-4 w-4" />
                        <span>{liked ? "Saved" : "Watchlist"}</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Profile link copied.");
                        }}
                        className="btn-secondary text-sm"
                      >
                        <HiShare className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  <p className="mt-6 max-w-3xl leading-relaxed text-dark-300">{player.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all ${
                activeTab === tab ? "bg-primary-500 text-white" : "bg-dark-900/70 text-dark-300 hover:bg-dark-800 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-8">
              <PlayerStats player={{ ...player, seasonStats }} />

              <Card className="p-6">
                <h3 className="mb-5 text-xl font-bold text-white">Player Details</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Height", value: player.height || "183 cm" },
                    { label: "Weight", value: player.weight || "76 kg" },
                    { label: "Preferred Foot", value: player.foot || "Right" },
                    { label: "Position", value: player.apiPosition || player.position },
                    { label: "Contract", value: player.contractUntil || "2027" },
                    { label: "Salary Band", value: player.salaryBand || "EUR 10K / week" },
                    { label: "Status", value: player.status || "Under review" },
                    { label: "Availability", value: player.availability || "Open to discussion" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                      <p className="text-xs uppercase tracking-wider text-dark-400">{item.label}</p>
                      <p className="mt-2 font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="mb-5 flex items-center gap-2">
                  <HiTrendingUp className="h-5 w-5 text-primary-400" />
                  <h3 className="text-xl font-bold text-white">Scout Summary</h3>
                </div>
                <p className="leading-relaxed text-dark-300">{player.scoutSummary}</p>
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-300">Strengths</p>
                    <div className="space-y-2">
                      {(player.strengths || []).map((item) => (
                        <div key={item} className="rounded-xl border border-white/5 bg-dark-900/50 px-4 py-3 text-sm text-dark-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-300">Development Areas</p>
                    <div className="space-y-2">
                      {(player.developmentAreas || []).map((item) => (
                        <div key={item} className="rounded-xl border border-white/5 bg-dark-900/50 px-4 py-3 text-sm text-dark-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-300">Recent Form</p>
                    <div className="space-y-2">
                      {(player.recentForm || []).map((item) => (
                        <div key={item} className="rounded-xl border border-white/5 bg-dark-900/50 px-4 py-3 text-sm text-dark-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="p-6">
                <h3 className="mb-5 text-xl font-bold text-white">Skill Profile</h3>
                <SkillRadar skills={player.skills} />
              </Card>

              <Card className="p-6">
                <h3 className="mb-5 text-xl font-bold text-white">Scout Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <HiMail className="h-5 w-5 text-primary-400" />
                    <div>
                      <p className="text-sm text-dark-400">Primary Contact</p>
                      <p className="font-medium text-white">{player.contactEmail || "scouting@footballtalent.pro"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-dark-900/50 p-4">
                    <GiRunningShoe className="h-5 w-5 text-primary-400" />
                    <div>
                      <p className="text-sm text-dark-400">Recommended Role</p>
                      <p className="font-medium text-white">{player.apiPosition || "Forward"}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-5 text-xl font-bold text-white">Profile Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(player.comparisons || []).map((item) => (
                    <span key={item} className="rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1.5 text-xs font-semibold text-primary-300">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        ) : null}

        {activeTab === "stats" ? <PlayerStats player={{ ...player, seasonStats }} /> : null}

        {activeTab === "highlights" ? (
          <Card className="p-6">
            <h3 className="mb-5 text-xl font-bold text-white">Highlights</h3>
            <div className="space-y-4">
              {(player.highlights || []).map((highlight) => (
                <div key={highlight.title} className="flex items-center justify-between rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/10">
                      <HiPlay className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{highlight.title}</p>
                      <p className="text-sm text-dark-400">{highlight.date}</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary-300 hover:text-primary-200">Review Clip</button>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === "achievements" ? (
          <Card className="p-6">
            <h3 className="mb-5 text-xl font-bold text-white">Achievements</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {(player.achievements || []).map((achievement) => (
                <div key={achievement} className="flex items-center gap-3 rounded-xl border border-white/5 bg-dark-900/50 p-4">
                  <GiTrophy className="h-5 w-5 text-amber-400" />
                  <span className="font-medium text-white">{achievement}</span>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default PlayerProfile;
