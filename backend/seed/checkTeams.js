const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Team = require("../models/team");

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const checkTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const teams = await Team.find().select("name city leagueName");

    console.log("Teams in database:");
    teams.forEach((team) => {
      console.log(`- ${team.name} | ${team.city} | ${team.leagueName}`);
    });

    console.log(`Total teams: ${teams.length}`);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

checkTeams();
