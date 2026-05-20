import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Trophy,
  ClipboardList,
  Search,
  LogOut,
  BarChart3,
  Globe2,
} from "lucide-react";

function Layout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("football_user") || "{}");
  const token = localStorage.getItem("football_token");

  const logout = () => {
    localStorage.removeItem("football_token");
    localStorage.removeItem("football_user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-logo">FT</div>
          <div>
            <h2>Kosovo Talent</h2>
            <p>Live scouting hub</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink to="/kosovo-live">
            <Globe2 size={19} />
            Kosovo Live
          </NavLink>

          <NavLink to="/dashboard">
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink to="/teams">
            <Trophy size={19} />
            Teams
          </NavLink>

          <NavLink to="/players">
            <Users size={19} />
            Players
          </NavLink>

          <NavLink to="/matches">
            <Shield size={19} />
            Matches
          </NavLink>

          <NavLink to="/scouts">
            <Search size={19} />
            Scouts
          </NavLink>

          <NavLink to="/scout-reports">
            <ClipboardList size={19} />
            Scout Reports
          </NavLink>

          <NavLink to="/analytics">
            <BarChart3 size={19} />
            Analytics
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <strong>{user.name || "Guest scout"}</strong>
            <span>{user.email || "Public live board"}</span>
          </div>

          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            {token ? "Logout" : "Login"}
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
