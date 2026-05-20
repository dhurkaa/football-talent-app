import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff, HiLockClosed, HiMail, HiUser, HiUserGroup } from "react-icons/hi";
import { GiSoccerBall } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "player"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
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

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      const response = await authAPI.register(payload);
      const token = response.data.token;
      const user = response.data.user || {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: payload.role
      };

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
