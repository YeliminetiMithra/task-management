import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StatsCards() {
  const [stats, setStats] = useState({
    thisMonth: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/task-main/");
      const tasks = res.data;

      const now = new Date();
      const thisMonthTasks = tasks.filter((t) => {
        const created = new Date(t.created_at);
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      });

      setStats({
        thisMonth: thisMonthTasks.length,
        inProgress: tasks.filter((t) => t.status === "In Progress").length,
        completed: tasks.filter((t) => t.status === "Completed").length,
        onHold: tasks.filter((t) => t.status === "On Hold").length,
      });
    } catch (err) {
      console.error("❌ Failed to load stats", err);
    }
  };

  const statsData = [
    {
      label: "Tasks This Month",
      value: stats.thisMonth,
      color: "#4f46e5", // Indigo
      iconUrl: "https://img.icons8.com/fluency/48/calendar.png",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      color: "#f59e0b", // Amber
      iconUrl: "https://img.icons8.com/color/48/in-progress.png",
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "#10b981", // Emerald
      iconUrl: "https://img.icons8.com/fluency/48/checked-checkbox.png",
    },
    {
      label: "On Hold",
      value: stats.onHold,
      color: "#ef4444", // Red
      iconUrl: "https://img.icons8.com/fluency/48/pause.png",
    },
  ];

  return (
    <section
      className="stats-container"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      {statsData.map((stat, idx) => (
        <div
          key={idx}
          className="card"
          style={{
            backgroundColor: stat.color,
            color: "#fff",
            borderRadius: "16px",
            padding: "20px",
            flex: "1 1 220px",
            minWidth: "220px",
            textAlign: "center",
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            transition: "transform 0.3s",
          }}
        >
          <img
            src={stat.iconUrl}
            alt={stat.label}
            style={{ width: "48px", height: "48px", marginBottom: "12px" }}
          />
          <h3 style={{ fontSize: "18px", margin: "0 0 8px" }}>{stat.label}</h3>
          <p style={{ fontSize: "26px", fontWeight: "bold", margin: 0 }}>
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}
