import React from "react";
import { Link } from "react-router-dom";
import { GiSoccerBall } from "react-icons/gi";
import { HiChartBar, HiClipboardList, HiLightningBolt, HiOfficeBuilding, HiPresentationChartBar, HiUserGroup } from "react-icons/hi";

const Footer = () => {
  const productLinks = [
    { label: "Players", path: "/players", icon: HiUserGroup },
    { label: "Clubs", path: "/clubs", icon: HiOfficeBuilding },
    { label: "Reports", path: "/reports", icon: HiClipboardList },
    { label: "Market Intel", path: "/market", icon: HiChartBar }
  ];

  const workflowLinks = [
    { label: "Shortlist Board", path: "/shortlist" },
    { label: "Presentation Mode", path: "/presentation" },
    { label: "Scout War Room", path: "/war-room" },
    { label: "Executive Summary", path: "/summary" }
  ];

  return (
    <footer className="border-t border-white/5 bg-dark-950">
      <div className="page-container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr_1.1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-emerald-500">
                <GiSoccerBall className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-display text-xl font-bold gradient-text">FootballTalent</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-dark-400">Scouting Workspace</p>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-dark-400">
              A clean football recruitment product for player discovery, decision support, and presentation-ready scouting stories.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-dark-300">Product</h3>
            <div className="mt-4 space-y-3">
              {productLinks.map((item) => (
                <Link key={item.label} to={item.path} className="flex items-center gap-2 text-sm text-dark-400 transition-colors hover:text-primary-300">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-dark-300">Workflow</h3>
            <div className="mt-4 space-y-3">
              {workflowLinks.map((item) => (
                <Link key={item.label} to={item.path} className="block text-sm text-dark-400 transition-colors hover:text-primary-300">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <HiPresentationChartBar className="h-5 w-5 text-primary-400" />
              <h3 className="text-lg font-bold text-white">Demo flow</h3>
            </div>
            <div className="space-y-3 text-sm text-dark-300">
              <p>1. Open Market Intel to frame demand and price movement.</p>
              <p>2. Move into Players and Reports for conviction and evidence.</p>
              <p>3. Close on Shortlist, Summary, and Presentation Mode.</p>
            </div>
            <Link to="/presentation" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 transition-colors hover:text-primary-200">
              <HiLightningBolt className="h-4 w-4" />
              <span>Launch presentation flow</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/5 pt-6 text-sm text-dark-500 md:flex-row md:items-center md:justify-between">
          <p>Built for tomorrow's room, but structured like a real product.</p>
          <div className="flex gap-5">
            <Link to="/about" className="transition-colors hover:text-dark-300">
              About
            </Link>
            <Link to="/summary" className="transition-colors hover:text-dark-300">
              Summary
            </Link>
            <Link to="/war-room" className="transition-colors hover:text-dark-300">
              War Room
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
