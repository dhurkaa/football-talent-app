import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  HiChartBar,
  HiClipboardList,
  HiCog,
  HiHome,
  HiLightningBolt,
  HiLogout,
  HiMenuAlt2,
  HiOfficeBuilding,
  HiPresentationChartBar,
  HiSearch,
  HiSparkles,
  HiTemplate,
  HiUserGroup,
  HiX
} from "react-icons/hi";
import { GiSoccerBall } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";

const primaryLinks = [
  { path: "/", label: "Home", icon: HiHome },
  { path: "/dashboard", label: "Dashboard", icon: HiChartBar },
  { path: "/players", label: "Players", icon: HiUserGroup },
  { path: "/ai-lab", label: "AI Lab", icon: HiSparkles },
  { path: "/matches", label: "Match Center", icon: HiSearch },
  { path: "/reports", label: "Scout Reports", icon: HiClipboardList }
];

const strategyLinks = [
  { path: "/clubs", label: "Clubs", icon: HiOfficeBuilding },
  { path: "/shortlist", label: "Shortlist", icon: HiTemplate },
  { path: "/war-room", label: "War Room", icon: HiLightningBolt },
  { path: "/summary", label: "Summary", icon: HiPresentationChartBar }
];

const utilityLinks = [
  { path: "/market", label: "Market Intel", icon: HiChartBar }
];

const SidebarNavSection = ({ title, links, onNavigate }) => (
  <div>
    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-500">{title}</p>
    <div className="space-y-1.5">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-primary-500/20 to-emerald-500/10 text-white border border-primary-500/20 shadow-glow-green"
                : "border border-transparent text-dark-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          <link.icon className="h-5 w-5 text-primary-300 transition-transform duration-300 group-hover:scale-110" />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </div>
  </div>
);

const AppSidebar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = useMemo(() => ["/login", "/register"].includes(location.pathname), [location.pathname]);
  const showSidebar = !isAuthPage;

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  if (!showSidebar) {
    return null;
  }

  const sidebarBody = (
    <div className="flex h-full flex-col">
      <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 via-emerald-400 to-primary-600 shadow-glow-green">
          <GiSoccerBall className="h-7 w-7 text-white" />
        </div>
        <div>
          <p className="font-display text-xl font-bold gradient-text">FootballTalent</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-dark-500">Scouting Workspace</p>
        </div>
      </Link>

      <div className="mt-8 overflow-y-auto pr-1">
        <SidebarNavSection title="Discover" links={primaryLinks} onNavigate={() => setMobileOpen(false)} />
        <div className="mt-7">
          <SidebarNavSection title="Decide" links={strategyLinks} onNavigate={() => setMobileOpen(false)} />
        </div>
        <div className="mt-7">
          <SidebarNavSection title="Deliver" links={utilityLinks} onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">Quick flow</p>
        <p className="mt-3 text-sm leading-relaxed text-dark-300">
          Start in Players or AI Lab, move to Match Center and Reports, then close in Shortlist and Summary.
        </p>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-dark-900/70 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/15 text-sm font-bold text-primary-200">
            {(user?.name || "G").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{user?.name || "Guest mode"}</p>
            <p className="truncate text-xs uppercase tracking-[0.16em] text-dark-500">{isAuthenticated ? user?.role || "scout" : "demo workspace"}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            to={isAuthenticated ? "/edit-profile" : "/login"}
            onClick={() => setMobileOpen(false)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-dark-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            <HiCog className="h-4 w-4" />
            <span>{isAuthenticated ? "Settings" : "Sign In"}</span>
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/20"
            >
              <HiLogout className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-dark-950/90 px-4 py-4 backdrop-blur-xl lg:hidden">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-emerald-500">
            <GiSoccerBall className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-display text-lg font-bold gradient-text">FootballTalent</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-dark-500">Scouting</p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen((current) => !current)}
          className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-white"
        >
          {mobileOpen ? <HiX className="h-5 w-5" /> : <HiMenuAlt2 className="h-5 w-5" />}
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-white/5 bg-dark-950/95 px-5 py-6 backdrop-blur-xl lg:block">
        {sidebarBody}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-dark-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[88vw] max-w-sm border-r border-white/10 bg-dark-950 px-5 py-6 shadow-2xl">
            {sidebarBody}
          </aside>
        </div>
      ) : null}
    </>
  );
};

export default AppSidebar;
