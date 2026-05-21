import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff, HiLockClosed, HiMail, HiUser, HiUserGroup } from "react-icons/hi";
import { GiSoccerBall } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { authAPI, premierLeagueAPI } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "player",
    selectedPremierLeagueTeamId: "",
    selectedPremierLeaguePlayerId: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  const [playerOptions, setPlayerOptions] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      if (formData.role !== "scout") {
        return;
      }

      setLoadingTeams(true);
      try {
        const response = await premierLeagueAPI.getTeams();
        setTeamOptions(response.data);
      } catch (error) {
        toast.error("Could not load Premier League teams.");
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [formData.role]);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (formData.role !== "scout" || !formData.selectedPremierLeagueTeamId) {
        setPlayerOptions([]);
        return;
      }

      setLoadingPlayers(true);
      try {
        const response = await premierLeagueAPI.getTeamPlayers(formData.selectedPremierLeagueTeamId);
        setPlayerOptions(response.data);
      } catch (error) {
        toast.error("Could not load squad players for that team.");
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [formData.role, formData.selectedPremierLeagueTeamId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "selectedPremierLeagueTeamId"
        ? { selectedPremierLeaguePlayerId: "" }
        : {})
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (
      formData.role === "scout" &&
      (!formData.selectedPremierLeagueTeamId || !formData.selectedPremierLeaguePlayerId)
    ) {
      toast.error("Scouts must choose a Premier League team and target player.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        selectedPremierLeagueTeamId: formData.selectedPremierLeagueTeamId || null,
        selectedPremierLeaguePlayerId: formData.selectedPremierLeaguePlayerId || null
      };
      const response = await authAPI.register(payload);
      const token = response.data.token;
      const user = response.data.user;

      login(user, token);
      toast.success("Account created successfully.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "player", label: "Player", icon: GiSoccerBall, desc: "Showcase your talent" },
    { value: "scout", label: "Scout", icon: HiUserGroup, desc: "Discover talent" }
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-hero-pattern bg-grid-lg opacity-20" />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass-card p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-emerald-500 shadow-glow-green">
              <GiSoccerBall className="h-9 w-9 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Join the Platform</h1>
            <p className="mt-2 text-dark-400">Create an account and start your journey.</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {roles.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => setFormData((current) => ({ ...current, role: role.value }))}
                className={`rounded-xl border-2 p-4 text-left transition-all duration-300 ${
                  formData.role === role.value
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <role.icon className={`mb-2 h-6 w-6 ${formData.role === role.value ? "text-primary-400" : "text-dark-400"}`} />
                <p className={`text-sm font-semibold ${formData.role === role.value ? "text-white" : "text-dark-300"}`}>{role.label}</p>
                <p className="mt-1 text-xs text-dark-500">{role.desc}</p>
              </button>
            ))}
          </div>

          {formData.role === "scout" ? (
            <div className="mb-6 space-y-4 rounded-2xl border border-primary-500/15 bg-primary-500/5 p-4">
              <div>
                <label className="field-label">Premier League Club</label>
                <select
                  name="selectedPremierLeagueTeamId"
                  value={formData.selectedPremierLeagueTeamId}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loadingTeams}
                  required
                >
                  <option value="">{loadingTeams ? "Loading teams..." : "Select a club"}</option>
                  {teamOptions.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Target Player</label>
                <select
                  name="selectedPremierLeaguePlayerId"
                  value={formData.selectedPremierLeaguePlayerId}
                  onChange={handleChange}
                  className="input-field"
                  disabled={!formData.selectedPremierLeagueTeamId || loadingPlayers}
                  required
                >
                  <option value="">
                    {!formData.selectedPremierLeagueTeamId
                      ? "Choose a club first"
                      : loadingPlayers
                      ? "Loading squad..."
                      : "Select a player"}
                  </option>
                  {playerOptions.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.displayName} · {player.position}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="field-label">Full Name</label>
              <div className="relative">
                <HiUser className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Email Address</label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="field-label">Confirm Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-12"
                />
              </div>
            </div>

            <label className="flex items-start gap-3">
              <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-white/20 bg-dark-800 text-primary-500" />
              <span className="text-sm text-dark-400">I agree to the terms, privacy policy, and platform conduct standards.</span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary mt-4 w-full py-4 text-lg">
              {loading ? <GiSoccerBall className="h-5 w-5 animate-spin" /> : <span>Create Account</span>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary-300 hover:text-primary-200">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
