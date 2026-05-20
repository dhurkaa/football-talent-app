const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Football Talent & Match Analytics API is running...");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/players", require("./routes/playerRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/scouts", require("./routes/scoutRoutes"));
app.use("/api/scout-reports", require("./routes/scoutReportRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});