const mongoose = require("mongoose");
const dns = require("dns");
const Team = require("../models/team");
const Player = require("../models/player");
const Match = require("../models/match");
const Scout = require("../models/scout");
const ScoutReport = require("../models/scoutreport");
const User = require("../models/user");

// Force Node.js to use public DNS servers for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    await Promise.all([
      User.syncIndexes(),
      Team.syncIndexes(),
      Player.syncIndexes(),
      Match.syncIndexes(),
      Scout.syncIndexes(),
      ScoutReport.syncIndexes()
    ]);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
