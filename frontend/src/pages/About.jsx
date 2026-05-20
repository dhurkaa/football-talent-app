import React from "react";
import { HiChartBar, HiGlobe, HiShieldCheck, HiUserGroup } from "react-icons/hi";
import Card from "../components/common/Card";

const About = () => {
  const pillars = [
    {
      icon: HiUserGroup,
      title: "Built for people doing the work",
      text: "Players, scouts, and analysts need clean context, fast workflows, and fewer dead ends."
    },
    {
      icon: HiChartBar,
      title: "Structured signal over noise",
      text: "Profiles, performance, and comparison views are designed to help real decisions happen sooner."
    },
    {
      icon: HiShieldCheck,
      title: "Trusted data handling",
      text: "Verification, organized records, and clear ownership keep collaboration reliable."
    },
    {
      icon: HiGlobe,
      title: "Global by default",
      text: "The platform supports discovery across markets, leagues, and pathways without losing context."
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-400">About FootballTalent</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">A serious scouting platform with a cleaner operating model.</h1>
          <p className="mt-5 text-lg leading-relaxed text-dark-300">
            FootballTalent is built to make talent discovery more legible. Better profiles, clearer analytics, and tighter workflows help people spend less time chasing context and more time making strong football decisions.
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
      </div>
    </div>
  );
};

export default About;
