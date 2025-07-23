import React from "react";
import { useTasks } from "../context/TaskContext";
import "./TeamTasksPage.css"; // Reuse styles

export default function MyTasksPage() {
  const { tasks } = useTasks();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const myTasks = tasks.filter(
    (task) =>
      (task.assignType === "individual" && task.assignee === currentUser?.user_id) ||
      (task.assignType === "team" && task.assignee === currentUser?.user_id)
  );

  return (
    <div className="task-grid-container">
      <h2>📝 My Tasks</h2>
      {myTasks.length === 0 ? (
        <p className="no-tasks">No tasks assigned to you.</p>
      ) : (
        <div className="task-cards">
          {myTasks.map((task) => (
            <div key={task.task_main_ID} className="task-card">
              <div className="task-id">ID: {task.task_main_ID}</div>
              <h3 className="task-title">{task.title}</h3>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Due:</strong> {task.dueDate || "—"}</p>
              <p><strong>Assign Type:</strong> {task.assignType}</p>
              <p><strong>Assignee:</strong> {task.assignee || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
