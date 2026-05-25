import axios from "axios";
import { sampleClubs, sampleMatches, samplePlayers, scoutReports } from "./mockData";

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

const positionLabelMap = {
  Goalkeeper: "GK",
  Defender: "DEF",
  Midfielder: "MID",
  Forward: "FWD"
};

const formatCurrency = (value) =>
  typeof value === "number" ? `EUR ${value.toLocaleString()}` : value || "Not set";

const normalizePlayer = (player, index = 0) => ({
  id: player._id || player.id || String(index + 1),
  createdAt: player.createdAt || null,
  name: player.fullName || player.name || "Unnamed Player",
  fullName: player.fullName || player.name || "Unnamed Player",
  position: positionLabelMap[player.position] || player.position || "N/A",
  apiPosition: player.position || "Unknown",
  age: player.age ?? null,
  nationality: player.nationality || "Unknown",
  club: player.teamId?.name || player.club || "Unassigned team",
  rating: typeof player.rating === "number" ? player.rating : null,
  goals: player.goals ?? player.stats?.goals ?? 0,
  assists: player.assists ?? player.stats?.assists ?? 0,
  matches: player.matches ?? player.stats?.matchesPlayed ?? 0,
  height: player.height ? `${player.height} cm` : "Not set",
  weight: player.weight || "Not set",
  foot: player.preferredFoot || player.foot || "Not set",
  marketValue: formatCurrency(player.marketValue),
  salaryBand: player.salaryBand || "Not set",
  contractUntil: player.contractUntil || "Not set",
  status: player.status || "Active",
  availability: player.availability || "Not set",
  bio: player.bio || "No player biography has been added yet.",
  location: player.location || player.nationality || "Unknown",
  strengths: player.strengths || [],
  developmentAreas: player.developmentAreas || [],
  recentForm: player.recentForm || [],
  scoutSummary: player.scoutSummary || "No scouting summary has been written yet.",
  comparisons: player.comparisons || [],
  seasonStats: {
    appearances: player.stats?.matchesPlayed ?? player.matches ?? 0,
    goals: player.stats?.goals ?? player.goals ?? 0,
    assists: player.stats?.assists ?? player.assists ?? 0,
    yellowCards: player.stats?.yellowCards ?? 0,
    redCards: player.stats?.redCards ?? 0,
    minutesPlayed: player.seasonStats?.minutesPlayed ?? 0,
    passAccuracy: player.seasonStats?.passAccuracy ?? 0,
    shotsOnTarget: player.seasonStats?.shotsOnTarget ?? 0
  },
  highlights: player.highlights || [],
  achievements: player.achievements || [],
  skills:
    player.skills || {
      pace: 0,
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      physical: 0
    }
});

const normalizeMatch = (match, index = 0) => ({
  id: match._id || index,
  createdAt: match.createdAt || null,
  home: match.homeTeamId?.name || match.home || "Home Team",
  away: match.awayTeamId?.name || match.away || "Away Team",
  date: match.matchDate || match.date || new Date().toISOString(),
  venue: match.stadium || match.venue || "Venue not set",
  status: match.status || "scheduled",
  scoreHome: match.scoreHome ?? null,
  scoreAway: match.scoreAway ?? null,
  scouts: match.scouts || 0,
  featuredProspects: match.featuredProspects || [],
  storyline: match.storyline || "",
  competition: match.competition || "",
  broadcast: match.broadcast || ""
});

const normalizeTeam = (team, index = 0) => ({
  id: team._id || String(index + 1),
  createdAt: team.createdAt || null,
  name: team.name || "Unnamed Team",
  city: team.city || "Unknown city",
  foundedYear: team.foundedYear ?? null,
  coachName: team.coachName || "Not set",
  stadium: team.stadium || "Not set",
  leagueName: team.leagueName || "Not set",
  squadSize: team.squadSize ?? 0,
  averageAge: team.averageAge ?? 0,
  totalMarketValue: formatCurrency(team.totalMarketValue),
  averageMarketValue: formatCurrency(team.averageMarketValue),
  source: team.source || "",
  country: team.country || "England",
  priorityNeed: team.priorityNeed || "Needs review",
  style: team.style || "Not set",
  budget: team.budget || formatCurrency(team.totalMarketValue),
  scouts: team.scouts ?? 0,
  note: team.note || "No recruitment note has been added yet."
});

const normalizeReport = (report, index = 0) => ({
  id: report._id || String(index + 1),
  createdAt: report.createdAt || null,
  playerId: report.playerId?._id || report.playerId,
  player: report.playerId?.fullName || "Unknown player",
  club: report.playerId?.teamId?.name || "Unassigned team",
  competition: report.competition || "",
  roleFit: report.playerId?.position || "Unknown role",
  author: report.scoutId?.fullName || "Unknown scout",
  date: report.reportDate || report.createdAt,
  summary: report.recommendation || "No summary provided.",
  score: report.rating ?? 0,
  verdict:
    report.rating >= 8 ? "Priority target" : report.rating >= 6 ? "Monitor closely" : "Development play",
  risks: report.weaknesses?.join(", ") || "No risks captured yet.",
  recommendation: report.recommendation || "No recommendation recorded.",
  strengths: report.strengths || [],
  weaknesses: report.weaknesses || []
});

const normalizeNewsItem = (item, index = 0) => ({
  id: item.guid || item.link || String(index + 1),
  title: item.title,
  link: item.link,
  description: item.description || "",
  publishedAt: item.pubDate,
  sourceName: item.sourceName || "BBC Sport Premier League"
});

const normalizeOverview = (payload = {}) => ({
  teams: Array.isArray(payload.teams) ? payload.teams.map(normalizeTeam) : [],
  players: Array.isArray(payload.players) ? payload.players.map(normalizePlayer) : [],
  matches: Array.isArray(payload.matches) ? payload.matches.map(normalizeMatch) : [],
  scouts: Array.isArray(payload.scouts) ? payload.scouts : [],
  reports: Array.isArray(payload.reports) ? payload.reports.map(normalizeReport) : [],
  news: Array.isArray(payload.news) ? payload.news.map(normalizeNewsItem) : [],
  stats: payload.stats || {
    teamCount: 0,
    playerCount: 0,
    matchCount: 0,
    scoutCount: 0,
    reportCount: 0
  }
});

const mockOverview = normalizeOverview({
  teams: sampleClubs,
  players: samplePlayers,
  matches: sampleMatches,
  reports: scoutReports,
  news: [],
  stats: {
    teamCount: sampleClubs.length,
    playerCount: samplePlayers.length,
    matchCount: sampleMatches.length,
    scoutCount: 6,
    reportCount: scoutReports.length
  }
});

const withFallback = (items, fallbackItems) => (Array.isArray(items) && items.length ? items : fallbackItems);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => Promise.resolve({ data }),
  updateScoutPreferences: (data) => api.patch("/auth/scout-preferences", data),
  getWatchlist: async () => {
    const response = await api.get("/auth/watchlist");
    return { ...response, data: Array.isArray(response.data) ? response.data.map(normalizePlayer) : [] };
  },
  addToWatchlist: (playerId) => api.post(`/auth/watchlist/${playerId}`),
  removeFromWatchlist: (playerId) => api.delete(`/auth/watchlist/${playerId}`)
};

export const premierLeagueAPI = {
  getTeams: async () => {
    const response = await api.get("/premier-league/teams");
    return { ...response, data: response.data || [] };
  },
  getTeamPlayers: async (teamId) => {
    const response = await api.get(`/premier-league/teams/${teamId}/players`);
    return { ...response, data: response.data || [] };
  },
  getTeamWorkspace: async (teamId) => {
    const response = await api.get(`/premier-league/teams/${teamId}`);
    return { ...response, data: response.data };
  },
  getPlayerDetails: async (playerId) => {
    const response = await api.get(`/premier-league/players/${playerId}`);
    return { ...response, data: response.data };
  },
  getScoutWorkspace: async () => {
    const response = await api.get("/premier-league/scout-workspace");
    return { ...response, data: response.data };
  }
};

export const playerAPI = {
  getAll: async (params) => {
    try {
      const response = await api.get("/players", { params });
      const normalized = Array.isArray(response.data) ? response.data.map(normalizePlayer) : [];
      return {
        ...response,
        data: withFallback(normalized, samplePlayers)
      };
    } catch (error) {
      return { data: samplePlayers };
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/players/${id}`);
      return { ...response, data: normalizePlayer(response.data) };
    } catch (error) {
      return { data: samplePlayers.find((player) => player.id === id) || samplePlayers[0] || null };
    }
  },
  create: (data) => api.post("/players", data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  search: async (query) => {
    const response = await playerAPI.getAll();
    const filtered = response.data.filter((player) =>
      [player.name, player.nationality, player.club].some((value) => value.toLowerCase().includes(query.toLowerCase()))
    );
    return { data: filtered };
  }
};

export const teamAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/teams");
      const normalized = Array.isArray(response.data) ? response.data.map(normalizeTeam) : [];
      return {
        ...response,
        data: withFallback(normalized, sampleClubs)
      };
    } catch (error) {
      return { data: sampleClubs };
    }
  },
  create: (data) => api.post("/teams", data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`)
};

export const reportAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/scout-reports");
      const normalized = Array.isArray(response.data) ? response.data.map(normalizeReport) : [];
      return {
        ...response,
        data: withFallback(normalized, scoutReports)
      };
    } catch (error) {
      return { data: scoutReports };
    }
  },
  create: (data) => api.post("/scout-reports", data),
  update: (id, data) => api.put(`/scout-reports/${id}`, data),
  delete: (id) => api.delete(`/scout-reports/${id}`)
};

export const scoutCrudAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/scouts");
      return { ...response, data: Array.isArray(response.data) ? response.data : [] };
    } catch (error) {
      return { data: [] };
    }
  },
  create: (data) => api.post("/scouts", data),
  update: (id, data) => api.put(`/scouts/${id}`, data),
  delete: (id) => api.delete(`/scouts/${id}`)
};

export const matchAPI = {
  getAll: async () => {
    try {
      const response = await api.get("/matches");
      const normalized = Array.isArray(response.data) ? response.data.map(normalizeMatch) : [];
      return {
        ...response,
        data: withFallback(normalized, sampleMatches)
      };
    } catch (error) {
      return { data: sampleMatches };
    }
  },
  getById: (id) => api.get(`/matches/${id}`),
  create: (data) => api.post("/matches", data)
};

export const newsAPI = {
  getPremierLeagueLatest: async () => {
    try {
      const response = await api.get("/news/premier-league");
      return {
        ...response,
        data: {
          ...response.data,
          items: Array.isArray(response.data?.items) ? response.data.items.map(normalizeNewsItem) : []
        }
      };
    } catch (error) {
      return {
        data: {
          competition: "Premier League",
          country: "England",
          source: "BBC Sport Premier League RSS",
          items: []
        }
      };
    }
  }
};

export const overviewAPI = {
  getWorkspace: async () => {
    try {
      const response = await api.get("/overview");
      const normalized = normalizeOverview(response.data);
      return {
        ...response,
        data: {
          ...normalized,
          teams: withFallback(normalized.teams, mockOverview.teams),
          players: withFallback(normalized.players, mockOverview.players),
          matches: withFallback(normalized.matches, mockOverview.matches),
          reports: withFallback(normalized.reports, mockOverview.reports),
          news: withFallback(normalized.news, mockOverview.news),
          stats: {
            teamCount: withFallback(normalized.teams, mockOverview.teams).length,
            playerCount: withFallback(normalized.players, mockOverview.players).length,
            matchCount: withFallback(normalized.matches, mockOverview.matches).length,
            scoutCount: normalized.stats?.scoutCount || mockOverview.stats.scoutCount,
            reportCount: withFallback(normalized.reports, mockOverview.reports).length
          }
        }
      };
    } catch (error) {
      return { data: mockOverview };
    }
  }
};

export const scoutAPI = {
  getWatchlist: () => authAPI.getWatchlist(),
  addToWatchlist: (playerId) => authAPI.addToWatchlist(playerId),
  removeFromWatchlist: (playerId) => authAPI.removeFromWatchlist(playerId),
  getRecommendations: async () => {
    const overview = await overviewAPI.getWorkspace();
    const roleMap = new Map();

    overview.data.players.forEach((player) => {
      const key = player.apiPosition || "Unknown";
      const current = roleMap.get(key) || { name: key, count: 0 };
      roleMap.set(key, { ...current, count: current.count + 1 });
    });

    const data = [...roleMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((item) => ({
        name: item.name,
        clubs: item.count,
        openRoles: item.count,
        urgency: item.count >= 3 ? "High" : "Medium",
        note: `You currently track ${item.count} player${item.count === 1 ? "" : "s"} in this position group.`
      }));

    return { data };
  }
};

export default api;
