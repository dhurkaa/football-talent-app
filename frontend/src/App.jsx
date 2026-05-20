import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Teams from "./pages/teams";
import Players from "./pages/players";
import PlayerProfile from "./pages/playerProfile";
import Matches from "./pages/matches";
import Scouts from "./pages/scouts";
import ScoutReports from "./pages/scoutReports";
import Analytics from "./pages/analytics";
import KosovoLive from "./pages/kosovoLive";
import ProtectedRoute from "./components/protectedRoute";
import Layout from "./components/layout";

function HomeRedirect() {
  const token = localStorage.getItem("football_token");

  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/kosovo-live"
        element={
          <Layout>
            <KosovoLive />
          </Layout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Layout>
              <Teams />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/players"
        element={
          <ProtectedRoute>
            <Layout>
              <Players />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/players/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <PlayerProfile />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <Layout>
              <Matches />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/scouts"
        element={
          <ProtectedRoute>
            <Layout>
              <Scouts />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/scout-reports"
        element={
          <ProtectedRoute>
            <Layout>
              <ScoutReports />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
