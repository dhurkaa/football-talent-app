import React from "react";
import { HiChartBar, HiDatabase, HiGlobe, HiShieldCheck, HiUserGroup } from "react-icons/hi";
import Card from "../components/common/Card";

const About = () => {
  const pillars = [
    {
      icon: HiUserGroup,
      title: "Frontend with React.js",
      text: "The user interface is built in React. Pages send HTTP requests, show forms, display tables, and render CRUD results for the logged-in user."
    },
    {
      icon: HiGlobe,
      title: "Backend with Node.js and Express.js",
      text: "The backend exposes REST API routes such as /api/auth, /api/players, /api/teams, /api/matches, /api/scouts, and /api/scout-reports."
    },
    {
      icon: HiDatabase,
      title: "Database with MongoDB",
      text: "MongoDB stores users, teams, players, scouts, matches, and scout reports. Mongoose models define schema rules and references between collections."
    },
    {
      icon: HiShieldCheck,
      title: "Protected login flow",
      text: "Users register and log in through JWT authentication. Protected routes use the token to ensure each user only accesses their own records."
    }
  ];

  const flow = [
    "React form sends data with Axios to an Express route.",
    "Express route validates the request and uses a Mongoose model.",
    "Mongoose reads from or writes to MongoDB.",
    "The backend returns JSON to the frontend.",
    "React updates the UI with the new data."
  ];

  const requirements = [
    "Login and register are implemented through /api/auth/register and /api/auth/login.",
    "CRUD for teams is demonstrated inside the existing Clubs page.",
    "CRUD for players is demonstrated inside the existing Players page.",
    "CRUD for matches is demonstrated inside the existing Matches page.",
    "CRUD for scouts and scout reports is demonstrated inside the existing Reports page.",
    "All of these frontend actions communicate with the Express backend and MongoDB models."
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-12 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">Project Explanation</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Full-stack CRUD application with React, Express, and MongoDB.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-dark-300">
            This project is structured to satisfy the course requirements: it includes login, protected routes, MongoDB
            persistence, Node.js and Express.js backend logic, and clear CRUD operations that can be demonstrated in the UI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="p-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500/10">
                <pillar.icon className="h-7 w-7 text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{pillar.title}</h2>
              <p className="mt-3 leading-relaxed text-dark-400">{pillar.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
          <Card className="p-8">
            <div className="mb-5 flex items-center gap-2">
              <HiChartBar className="h-5 w-5 text-primary-400" />
              <h2 className="text-2xl font-bold text-white">How the connection works</h2>
            </div>
            <div className="space-y-3">
              {flow.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/5 bg-dark-900/50 p-4 text-sm text-dark-300">
                  <span className="mr-2 font-semibold text-primary-300">{index + 1}.</span>
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <div className="mb-5 flex items-center gap-2">
              <HiShieldCheck className="h-5 w-5 text-primary-400" />
              <h2 className="text-2xl font-bold text-white">Requirement checklist</h2>
            </div>
            <div className="space-y-3">
              {requirements.map((item) => (
                <div key={item} className="rounded-2xl border border-white/5 bg-dark-900/50 p-4 text-sm text-dark-300">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
