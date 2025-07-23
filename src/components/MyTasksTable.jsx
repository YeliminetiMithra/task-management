import React from "react";
import { useTasks } from "../context/TaskContext";

export default function MyTasksTable({ currentUser }) {
  const { tasks } = useTasks();

  // Filter tasks assigned individually to the current user
  const myTasks = tasks.filter(
    (task) => task.assignType === "individual" && task.assignee === currentUser
  );

  return (
    <div className="task-column">
      <h2>🧍 My Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {myTasks.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No tasks found
              </td>
            </tr>
          ) : (
            myTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.dueDate || "-"}</td>
                <td>
                  <button>View</button>
                  <button>Update</button>
                  <button>Add Update</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
