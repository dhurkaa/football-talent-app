import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Players from "./pages/players";
import PlayerProfile from "./pages/playerProfile";
import ScoutDashboard from "./pages/ScoutDashboard";
import EditProfile from "./pages/EditProfile";
import Matches from "./pages/matches";
import Market from "./pages/market";
import Clubs from "./pages/clubs";
import Reports from "./pages/reports";
import Summary from "./pages/summary";
import Shortlist from "./pages/shortlist";
import WarRoom from "./pages/warRoom";
import NotFound from "./pages/NotFound";
import AILab from "./pages/aiLab";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const DashboardRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user?.role === "scout" ? <ScoutDashboard /> : <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "16px"
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fff" }
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" }
          }
        }}
      />

      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />
          <Route path="/players" element={<Players />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/market" element={<Market />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/shortlist" element={<Shortlist />} />
          <Route path="/war-room" element={<WarRoom />} />
          <Route path="/ai-lab" element={<AILab />} />
          <Route
            path="/scout"
            element={
              <ProtectedRoute>
                <ScoutDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/matches" element={<Matches />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
