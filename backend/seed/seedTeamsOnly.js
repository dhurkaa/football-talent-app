const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Team = require("../models/team");

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
  },
  {
    name: "FC Ballkani",
    city: "Suharekë",
    foundedYear: 1947,
    coachName: "N/A",
    stadium: "Stadiumi i Qytetit, Suharekë",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
  {
    name: "FC Prishtina",
    city: "Prishtinë",
    foundedYear: 1922,
    coachName: "N/A",
    stadium: "Stadiumi Fadil Vokrri",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
  {
    name: "FC Malisheva",
    city: "Malishevë",
    foundedYear: 2016,
    coachName: "N/A",
    stadium: "Stadiumi Liman Gegaj",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
  {
    name: "SC Gjilani",
    city: "Gjilan",
    foundedYear: 1995,
    coachName: "N/A",
    stadium: "Stadiumi i Qytetit, Gjilan",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
  {
    name: "KF Llapi",
    city: "Podujevë",
    foundedYear: 1932,
    coachName: "N/A",
    stadium: "Stadiumi Zahir Pajaziti",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
  {
    name: "FC Ferizaj",
    city: "Ferizaj",
    foundedYear: 1923,
    coachName: "N/A",
    stadium: "Stadiumi i Qytetit, Ferizaj",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
  {
    name: "KF Dukagjini",
    city: "Klinë",
    foundedYear: 1958,
    coachName: "N/A",
    stadium: "Stadiumi 18 Qershori",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
  {
    name: "FC Drenica",
    city: "Skenderaj",
    foundedYear: 1958,
    coachName: "N/A",
    stadium: "Stadiumi Bajram Aliu",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
  {
    name: "KF Prishtina e Re",
    city: "Prishtinë",
    foundedYear: 2016,
    coachName: "N/A",
    stadium: "N/A",
    leagueName: "ALBI MALL Superliga e Kosovës",
  },
];

const seedTeams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    let inserted = 0;
    let updated = 0;

    for (const team of teams) {
      const existing = await Team.findOne({ name: team.name });

      if (existing) {
        await Team.updateOne({ _id: existing._id }, team);
        updated++;
      } else {
        await Team.create(team);
        inserted++;
      }
    }

    console.log("Teams seed completed");
    console.log(`Inserted: ${inserted}`);
    console.log(`Updated: ${updated}`);

    process.exit(0);
  } catch (error) {
    console.error("Seed teams error:", error.message);
    process.exit(1);
  }
};

seedTeams();
