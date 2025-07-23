import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./teamTasksPage.css";

export default function TaskMainDetails() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 Fetch all TaskMain records
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/task-main/");
      const data = response.data.map((task) => ({
        ...task,
        subCategory: task.sub_category,
        assignType: task.assign_type,
        dueDate: task.due_date,
      }));
      setTasks(data);
    } catch (error) {
      console.error("❌ Failed to fetch TaskMain data:", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    (task.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.task_main_ID || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="task-main-wrapper">
      <div className="task-header">
        <h1>📋 Task Main Details</h1>
        <div className="task-top-bar">
          <input
            type="text"
            placeholder="🔍 Search tasks by title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="task-search-bar"
          />
          <button
            className="create-task-button"
            onClick={() => navigate("/create-task")}
          >
            ➕ Create Task
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="no-tasks-msg">❌ No matching tasks found.</p>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task, index) => (
            <div key={task.task_main_ID || index} className="task-card">
              <div className="task-id">
                ID: {task.task_main_ID || `TASK${String(index + 1).padStart(4, "0")}`}
              </div>
              <h3 className="task-title">{task.title || "Untitled Task"}</h3>
              <p><strong>Category:</strong> {task.category || "—"}</p>
              <p><strong>Sub Category:</strong> {task.subCategory || "—"}</p>
              <p><strong>Description:</strong> {task.description || "—"}</p>
              <p><strong>Assign Type:</strong> {task.assignType || "—"}</p>
              <p><strong>Assignee:</strong> {task.assignee || "—"}</p>
              <p><strong>Status:</strong> {task.status || "—"}</p>
              <p><strong>Priority:</strong> {task.priority || "—"}</p>
              <p><strong>Due Date:</strong> {task.dueDate || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
