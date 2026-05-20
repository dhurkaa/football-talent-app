import axios from "axios";
import { sampleMatches, samplePlayers, scoutTargets } from "./mockData";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("footballTalentToken") || localStorage.getItem("football_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("footballTalentUser");
      localStorage.removeItem("footballTalentToken");
    }
    return Promise.reject(error);
  }
);

const normalizePlayer = (player, index = 0) => ({
  id: player._id || player.id || String(index + 1),
  name: player.name || player.fullName || "Unknown Player",
  fullName: player.fullName || player.name || "Unknown Player",
  position:
    player.position === "Goalkeeper"
      ? "GK"
      : player.position === "Defender"
      ? "DEF"
      : player.position === "Midfielder"
      ? "MID"
      : player.position === "Forward"
      ? "FWD"
      : player.position || "MID",
  apiPosition: player.position || "Midfielder",
  age: player.age,
  nationality: player.nationality || player.country || "Unknown",
  club: player.club || player.teamId?.name || "Independent",
  rating: player.rating || Number((7.2 + (player.stats?.goals || 0) * 0.08).toFixed(1)),
  goals: player.goals ?? player.stats?.goals ?? 0,
  assists: player.assists ?? player.stats?.assists ?? 0,
  matches: player.matches ?? player.stats?.matchesPlayed ?? 0,
  height: player.height ? `${player.height}${typeof player.height === "number" ? " cm" : ""}` : "180 cm",
  weight: player.weight || "74 kg",
  foot: player.foot || player.preferredFoot || "Right",
  marketValue:
    typeof player.marketValue === "number"
      ? `EUR ${player.marketValue.toLocaleString()}`
      : player.marketValue || "EUR 2.5M",
  salaryBand: player.salaryBand || "EUR 10K / week",
  contractUntil: player.contractUntil || "2027",
  status: player.status || "Under review",
  availability: player.availability || "Open to discussion",
  bio:
    player.bio ||
    "Technical player with strong decision-making, repeatable output, and clear upside in structured environments.",
  location: player.location || player.nationality || "Unknown",
  strengths: player.strengths || ["Clean first touch", "Repeatable actions", "Strong role fit"],
  developmentAreas: player.developmentAreas || ["Needs more sample size at higher level"],
  recentForm: player.recentForm || ["Stable trend over last 5 matches"],
  scoutSummary: player.scoutSummary || "Scouting note pending.",
  comparisons: player.comparisons || ["Hybrid profile"],
  seasonStats:
    player.seasonStats || {
      appearances: player.matches ?? player.stats?.matchesPlayed ?? 0,
      goals: player.goals ?? player.stats?.goals ?? 0,
      assists: player.assists ?? player.stats?.assists ?? 0,
      yellowCards: player.stats?.yellowCards ?? 0,
      redCards: player.stats?.redCards ?? 0,
      minutesPlayed: 2500,
      passAccuracy: 82,
      shotsOnTarget: 40
    },
  highlights: player.highlights || [],
  achievements: player.achievements || [],
  skills:
    player.skills ||
    {
      pace: 78,
      shooting: 75,
      passing: 79,
      dribbling: 77,
      defending: 68,
      physical: 73
    }
});

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => Promise.resolve({ data })
};

export const playerAPI = {
  getAll: async (params) => {
    try {
      const response = await api.get("/players", { params });
      const data = Array.isArray(response.data)
        ? response.data.map((player, index) => normalizePlayer(player, index))
        : [];
      return { ...response, data: data.length ? data : samplePlayers };
    } catch (error) {
      return { data: samplePlayers };
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/players/${id}`);
      return { ...response, data: normalizePlayer(response.data) };
    } catch (error) {
      const fallback = samplePlayers.find((player) => player.id === id) || samplePlayers[0];
      return { data: fallback };
    }
  },
  create: (data) => api.post("/players", data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  search: async (query) => {
    const filtered = samplePlayers.filter((player) =>
      [player.name, player.nationality, player.club].some((value) =>
        value.toLowerCase().includes(query.toLowerCase())
      )
    );
    return { data: filtered };
  }
};

export const scoutAPI = {
  getWatchlist: async () => ({ data: samplePlayers.slice(0, 3) }),
  addToWatchlist: async (playerId) => ({ data: { success: true, playerId } }),
  removeFromWatchlist: async (playerId) => ({ data: { success: true, playerId } }),
  getRecommendations: async () => ({ data: scoutTargets })
};

export const matchAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/matches");
      const data = Array.isArray(response.data)
        ? response.data.map((match, index) => ({
            id: match._id || index,
            home: match.homeTeamId?.name || match.home || "Home Team",
            away: match.awayTeamId?.name || match.away || "Away Team",
            date: match.matchDate || match.date || new Date().toISOString(),
            venue: match.venue || "Main Stadium",
            status: match.status || "Upcoming",
            scouts: match.scouts || 0
          }))
        : [];
      return { ...response, data: data.length ? data : sampleMatches };
    } catch (error) {
      return { data: sampleMatches };
    }
  },
  getById: (id) => api.get(`/matches/${id}`),
  create: (data) => api.post("/matches", data)
};

export default api;
