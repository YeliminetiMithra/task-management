import React from "react";
import TaskMainDetails from "../tasks/TaskMainDetails";
import TaskAttachments from "../tasks/TaskAttachments";
import TaskUpdates from "../tasks/TaskUpdates";
import TaskAssignments from "../tasks/TaskAssignments";
import StatusTrack from "../tasks/StatusTrack";

export default function CreateTaskPage() {
  return (
    <section className="create-task-page">
      <h2 className="page-title">➕ Create New Task</h2>
      <div className="task-form-sections">
        <TaskMainDetails />
        <TaskAttachments />
        <TaskUpdates />
        <TaskAssignments />
        <StatusTrack />
      </div>
    </section>
  );
}
