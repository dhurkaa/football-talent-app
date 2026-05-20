import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiClipboardList,
  HiChartBar,
  HiGlobeAlt,
  HiHome,
  HiLightningBolt,
  HiLogout,
  HiMenu,
  HiPresentationChartBar,
  HiSearch,
  HiTemplate,
  HiOfficeBuilding,
  HiUserGroup,
  HiUser,
  HiX,
  HiCog
} from "react-icons/hi";
import { GiSoccerBall } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home", icon: HiHome },
    { path: "/players", label: "Players", icon: HiUserGroup },
    { path: "/clubs", label: "Clubs", icon: HiOfficeBuilding },
    { path: "/matches", label: "Matches", icon: HiChartBar },
    { path: "/reports", label: "Reports", icon: HiClipboardList },
    { path: "/market", label: "Market", icon: HiGlobeAlt },
    { path: "/shortlist", label: "Shortlist", icon: HiTemplate },
    { path: "/presentation", label: "Presentation", icon: HiPresentationChartBar },
    { path: "/war-room", label: "War Room", icon: HiLightningBolt }
  ];

  const authLinks = [
    { path: "/dashboard", label: "Dashboard", icon: HiChartBar },
    { path: "/summary", label: "Summary", icon: HiClipboardList },
    ...(user?.role === "scout" ? [{ path: "/scout", label: "Scout Panel", icon: HiSearch }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
      isActive ? "text-primary-400" : "text-dark-300 hover:text-white"
    }`;

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-dark-950/90 border-b border-white/5 backdrop-blur-xl shadow-2xl" : "bg-transparent"
      }`}
    >
      <div className="page-container">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.45 }} className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-emerald-500 shadow-glow-green">
                <GiSoccerBall className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            <div>
              <p className="font-display text-xl font-bold gradient-text">FootballTalent</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-dark-400">Elite Discovery Platform</p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <motion.span
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-xl border border-primary-500/20 bg-primary-500/10"
                      />
                    ) : null}
                    <span className="relative z-10">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
            {isAuthenticated &&
              authLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <motion.span
                          layoutId="active-nav"
                          className="absolute inset-0 rounded-xl border border-primary-500/20 bg-primary-500/10"
                        />
                      ) : null}
                      <span className="relative z-10">{link.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((current) => !current)}
                  className="glass flex items-center gap-3 rounded-xl px-4 py-2 transition-all duration-300 hover:border-primary-500/30"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-emerald-500">
                    <span className="text-sm font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{user?.name || "User"}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      className="glass-dark absolute right-0 mt-2 w-60 overflow-hidden rounded-xl shadow-2xl"
                    >
                      <div className="border-b border-white/5 p-4">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-dark-400">{user?.email}</p>
                        <span className="mt-2 inline-flex rounded-full bg-primary-500/15 px-2 py-0.5 text-xs capitalize text-primary-300">
                          {user?.role || "player"}
                        </span>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/edit-profile"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-dark-300 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <HiCog className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                          <HiLogout className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary py-2.5 text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-2.5 text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen((current) => !current)}
            className="glass rounded-xl p-2 transition-all duration-300 hover:border-primary-500/30 lg:hidden"
          >
            {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-dark-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="page-container py-5">
              <div className="space-y-2">
                {[...navLinks, ...(isAuthenticated ? authLinks : [])].map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? "border border-primary-500/20 bg-primary-500/10 text-primary-300"
                          : "text-dark-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </NavLink>
                ))}
              </div>

              <div className="mt-4 border-t border-white/5 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/edit-profile"
                      className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-dark-300 hover:bg-white/5 hover:text-white"
                    >
                      <HiUser className="h-5 w-5" />
                      <span className="font-medium">Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10"
                    >
                      <HiLogout className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="btn-secondary w-full py-3">
                      Sign In
                    </Link>
                    <Link to="/register" className="btn-primary w-full py-3">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
