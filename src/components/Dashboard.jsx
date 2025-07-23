import React from "react";
import StatsCards from "./StatsCards";
import TeamTasksTable from "./TeamTasksTable";
import MyTasksTable from "./MyTasksTable";

export default function Dashboard() {
  return (
    <>
      <StatsCards />
      <div className="tasks">
        <TeamTasksTable />
        <MyTasksTable />
      </div>
    </>
  );
}
