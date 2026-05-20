const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

const Team = require("../models/team");

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const csvPath = path.join(__dirname, "..", "data", "superliga_players.csv");

const debug = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const dbTeams = await Team.find().select("name");

  console.log("\nTEAMS IN DATABASE:");
  dbTeams.forEach((team) => console.log(`- [${team.name}]`));

  const csvTeams = new Set();

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => {
      csvTeams.add(row.teamName);
    })
    .on("end", () => {
      console.log("\nTEAM NAMES FOUND IN CSV:");
      [...csvTeams].forEach((name) => console.log(`- [${name}]`));

      console.log("\nFIRST CSV ROW CHECK:");
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          console.log(row);
          process.exit(0);
        });
    });
};

debug().catch((err) => {
  console.error(err);
  process.exit(1);
});
