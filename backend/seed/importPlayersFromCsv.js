const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

const Team = require("../models/team");
const Player = require("../models/player");

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const csvPath = path.join(__dirname, "..", "data", "superliga_players.csv");

const cleanText = (value) => {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .trim();
};

const normalizeKey = (value) => {
  return cleanText(value).toLowerCase();
};

const normalizeNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") return fallback;

  const cleaned = String(value)
    .replace("€", "")
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .trim();

  const number = Number(cleaned);
  return Number.isNaN(number) ? fallback : number;
};

const normalizePosition = (position) => {
  const p = normalizeKey(position);

  if (p.includes("goalkeeper") || p.includes("keeper")) return "Goalkeeper";
  if (p.includes("defender") || p.includes("back")) return "Defender";
  if (p.includes("midfield")) return "Midfielder";
  if (p.includes("forward") || p.includes("striker") || p.includes("winger")) return "Forward";

  return "Forward";
};

const normalizeFoot = (foot) => {
  const f = normalizeKey(foot);

  if (f.includes("left")) return "Left";
  if (f.includes("right")) return "Right";
  if (f.includes("both")) return "Both";

  return "Unknown";
};

const importPlayers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for CSV player import");

    if (!fs.existsSync(csvPath)) {
      console.log("CSV file not found:", csvPath);
      process.exit(1);
    }

    const teams = await Team.find();
    const teamMap = {};

    teams.forEach((team) => {
      teamMap[normalizeKey(team.name)] = team._id;
    });

    console.log("Teams loaded from database:", Object.keys(teamMap).length);

    const rows = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        let inserted = 0;
        let updated = 0;
        let skipped = 0;

        for (const row of rows) {
          const fullName = cleanText(row.fullName);
          const teamName = cleanText(row.teamName);
          const teamKey = normalizeKey(teamName);
          const teamId = teamMap[teamKey];

          if (!fullName) {
            console.log("Skipped empty player name:", row);
            skipped++;
            continue;
          }

          if (!teamId) {
            console.log(`Skipped: team not found for ${fullName} | CSV teamName: [${teamName}] | key: [${teamKey}]`);
            skipped++;
            continue;
          }

          const payload = {
            fullName,
            age: normalizeNumber(row.age, 18),
            position: normalizePosition(row.position),
            nationality: cleanText(row.nationality || "Unknown"),
            height: normalizeNumber(row.height, 0),
            preferredFoot: normalizeFoot(row.preferredFoot),
            teamId,
            marketValue: normalizeNumber(row.marketValue, 0),
            stats: {
              goals: normalizeNumber(row.goals, 0),
              assists: normalizeNumber(row.assists, 0),
              matchesPlayed: normalizeNumber(row.matchesPlayed, 0),
              yellowCards: normalizeNumber(row.yellowCards, 0),
              redCards: normalizeNumber(row.redCards, 0),
            },
            source: cleanText(row.source || "Public football source"),
          };

          const existing = await Player.findOne({
            fullName: payload.fullName,
            teamId: payload.teamId,
          });

          if (existing) {
            await Player.updateOne({ _id: existing._id }, payload);
            updated++;
          } else {
            await Player.create(payload);
            inserted++;
          }
        }

        console.log("CSV player import completed");
        console.log(`Inserted: ${inserted}`);
        console.log(`Updated: ${updated}`);
        console.log(`Skipped: ${skipped}`);

        process.exit(0);
      });
  } catch (error) {
    console.error("Import error:", error.message);
    process.exit(1);
  }
};

importPlayers();
