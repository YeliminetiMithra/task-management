import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header({ darkMode, setDarkMode, onLogout }) {
  const { user } = useContext(AuthContext);

  const toggleMode = () => setDarkMode((prev) => !prev);

  return (
    <header className="header">
      <div style={{ width: 40 }}></div>
      <h1 className="dashboard-title">📋 Tasks Dashboard</h1>
      <div className="profile">
        <span className="user-name">👤 {user?.username}</span>
        <button onClick={toggleMode} className="theme-toggle-btn">
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
        <button onClick={onLogout} className="logout-btn">
          🔓 Logout
        </button>
      </div>
    </header>
  );
}
