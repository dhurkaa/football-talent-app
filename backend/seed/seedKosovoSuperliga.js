const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

const Team = require("../models/team");
const Match = require("../models/match");
const Player = require("../models/player");

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const teams = [
  {
    name: "FC Drita",
    city: "Gjilan",
    foundedYear: 1947,
    coachName: "N/A",
    stadium: "Stadiumi i Qytetit, Gjilan",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 28,
    averageAge: 27.0,
    totalMarketValue: 7780000,
    averageMarketValue: 278000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "FC Ballkani",
    city: "Suharekë",
    foundedYear: 1947,
    coachName: "N/A",
    stadium: "Stadiumi i Qytetit, Suharekë",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 30,
    averageAge: 25.5,
    totalMarketValue: 7000000,
    averageMarketValue: 233000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "FC Prishtina",
    city: "Prishtinë",
    foundedYear: 1922,
    coachName: "N/A",
    stadium: "Stadiumi Fadil Vokrri",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 27,
    averageAge: 24.7,
    totalMarketValue: 5980000,
    averageMarketValue: 221000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "FC Malisheva",
    city: "Malishevë",
    foundedYear: 2016,
    coachName: "N/A",
    stadium: "Stadiumi Liman Gegaj",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 25,
    averageAge: 26.0,
    totalMarketValue: 5650000,
    averageMarketValue: 226000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "SC Gjilani",
    city: "Gjilan",
    foundedYear: 1995,
    coachName: "N/A",
    stadium: "Stadiumi i Qytetit, Gjilan",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 25,
    averageAge: 27.6,
    totalMarketValue: 5490000,
    averageMarketValue: 219000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "KF Llapi",
    city: "Podujevë",
    foundedYear: 1932,
    coachName: "N/A",
    stadium: "Stadiumi Zahir Pajaziti",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 29,
    averageAge: 25.5,
    totalMarketValue: 4450000,
    averageMarketValue: 153000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "FC Ferizaj",
    city: "Ferizaj",
    foundedYear: 1923,
    coachName: "N/A",
    stadium: "Stadiumi me bar sintetik, Ferizaj",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 29,
    averageAge: 26.2,
    totalMarketValue: 3790000,
    averageMarketValue: 131000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "KF Dukagjini",
    city: "Klinë",
    foundedYear: 1958,
    coachName: "N/A",
    stadium: "Stadiumi 18 Qershori",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 29,
    averageAge: 25.5,
    totalMarketValue: 3580000,
    averageMarketValue: 123000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "FC Drenica",
    city: "Skenderaj",
    foundedYear: 1958,
    coachName: "N/A",
    stadium: "Stadiumi Bajram Aliu",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 27,
    averageAge: 25.5,
    totalMarketValue: 3500000,
    averageMarketValue: 130000,
    source: "Transfermarkt 25/26",
  },
  {
    name: "KF Prishtina e Re",
    city: "Prishtinë",
    foundedYear: 2016,
    coachName: "N/A",
    stadium: "N/A",
    leagueName: "ALBI MALL Superliga e Kosovës",
    squadSize: 28,
    averageAge: 27.6,
    totalMarketValue: 3040000,
    averageMarketValue: 108000,
    source: "Transfermarkt 25/26",
  },
];

const recentMatches = [
  {
    date: "2026-05-02",
    home: "KF Prishtina e Re",
    away: "FC Drita",
    scoreHome: 0,
    scoreAway: 1,
    stadium: "N/A",
    status: "played",
  },
  {
    date: "2026-05-02",
    home: "FC Prishtina",
    away: "FC Malisheva",
    scoreHome: 0,
    scoreAway: 1,
    stadium: "N/A",
    status: "played",
  },
  {
    date: "2026-05-03",
    home: "SC Gjilani",
    away: "FC Ferizaj",
    scoreHome: 1,
    scoreAway: 1,
    stadium: "Stadiumi i Qytetit, Gjilan",
    status: "played",
  },
  {
    date: "2026-05-03",
    home: "KF Dukagjini",
    away: "FC Drenica",
    scoreHome: 0,
    scoreAway: 1,
    stadium: "Stadiumi 18 Qershori",
    status: "played",
  },
  {
    date: "2026-05-03",
    home: "FC Ballkani",
    away: "KF Llapi",
    scoreHome: 0,
    scoreAway: 1,
    stadium: "Stadiumi i Qytetit, Suharekë",
    status: "played",
  },
  {
    date: "2026-05-06",
    home: "KF Prishtina e Re",
    away: "FC Prishtina",
    scoreHome: 3,
    scoreAway: 2,
    stadium: "N/A",
    status: "played",
  },
  {
    date: "2026-05-09",
    home: "FC Drenica",
    away: "SC Gjilani",
    scoreHome: 2,
    scoreAway: 1,
    stadium: "Stadiumi Bajram Aliu",
    status: "played",
  },
  {
    date: "2026-05-09",
    home: "FC Drita",
    away: "FC Ballkani",
    scoreHome: 2,
    scoreAway: 0,
    stadium: "Stadiumi i Qytetit, Gjilan",
    status: "played",
  },
  {
    date: "2026-05-10",
    home: "KF Llapi",
    away: "KF Dukagjini",
    scoreHome: 0,
    scoreAway: 0,
    stadium: "Stadiumi Zahir Pajaziti",
    status: "played",
  },
  {
    date: "2026-05-10",
    home: "FC Ferizaj",
    away: "FC Malisheva",
    scoreHome: 1,
    scoreAway: 1,
    stadium: "Ferizaj",
    status: "played",
  },
];

const topScorers = [
  {
    fullName: "Kreshnik Uka",
    age: 31,
    position: "Forward",
    nationality: "Kosovar",
    height: 180,
    preferredFoot: "Right",
    teamName: "FC Drenica",
    marketValue: 150000,
    goals: 15,
  },
  {
    fullName: "Senad Jarovic",
    age: 28,
    position: "Forward",
    nationality: "Bosnia and Herzegovina",
    height: 194,
    preferredFoot: "Right",
    teamName: "SC Gjilani",
    marketValue: 600000,
    goals: 15,
  },
  {
    fullName: "Valentin Serebe",
    age: 23,
    position: "Forward",
    nationality: "Côte d'Ivoire",
    height: 180,
    preferredFoot: "Right",
    teamName: "FC Ballkani",
    marketValue: 600000,
    goals: 14,
  },
  {
    fullName: "Mario Ilievski",
    age: 23,
    position: "Forward",
    nationality: "North Macedonia",
    height: 180,
    preferredFoot: "Right",
    teamName: "FC Prishtina",
    marketValue: 500000,
    goals: 13,
  },
  {
    fullName: "Almir Kryeziu",
    age: 27,
    position: "Forward",
    nationality: "Kosovar",
    height: 180,
    preferredFoot: "Right",
    teamName: "FC Ballkani",
    marketValue: 500000,
    goals: 12,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding");

    await Team.deleteMany({});
    await Match.deleteMany({});
    await Player.deleteMany({});

    const createdTeams = await Team.insertMany(teams);
    console.log(`${createdTeams.length} real Kosovo Superliga teams inserted`);

    const teamMap = {};
    createdTeams.forEach((team) => {
      teamMap[team.name] = team._id;
    });

    const createdMatches = recentMatches
      .filter((match) => teamMap[match.home] && teamMap[match.away])
      .map((match) => ({
        homeTeamId: teamMap[match.home],
        awayTeamId: teamMap[match.away],
        matchDate: new Date(match.date),
        stadium: match.stadium,
        scoreHome: match.scoreHome,
        scoreAway: match.scoreAway,
        status: match.status,
      }));

    await Match.insertMany(createdMatches);
    console.log(`${createdMatches.length} real matches inserted`);

    const createdPlayers = topScorers
      .filter((player) => teamMap[player.teamName])
      .map((player) => ({
        fullName: player.fullName,
        age: player.age,
        position: player.position,
        nationality: player.nationality,
        height: player.height,
        preferredFoot: player.preferredFoot,
        teamId: teamMap[player.teamName],
        marketValue: player.marketValue,
        stats: {
          goals: player.goals,
          assists: 0,
          matchesPlayed: 0,
          yellowCards: 0,
          redCards: 0,
        },
      }));

    await Player.insertMany(createdPlayers);
    console.log(`${createdPlayers.length} real top scorers inserted`);

    console.log("Kosovo Superliga seed completed successfully");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
