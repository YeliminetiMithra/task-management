import React from "react";
import { NavLink } from "react-router-dom"; // Better than Link for active highlighting

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>📊 TaskManager</h2>
      <ul>
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-tasks" className={({ isActive }) => isActive ? "active" : ""}>
            📝 My Tasks
          </NavLink>
        </li>
        <li>
          <NavLink to="/team-tasks" className={({ isActive }) => isActive ? "active" : ""}>
            👥 Team Tasks
          </NavLink>
        </li>
        <li>
          <NavLink to="/create-task" className={({ isActive }) => isActive ? "active" : ""}>
            ➕ Create Task
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}>
            📈 Reports
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
