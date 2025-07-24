import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTasks } from "../context/TaskContext";
import styles from './TaskMainDetails.css';

export default function TaskMainDetails() {
  const initialForm = {
    category: "",
    sub_category: "",
    title: "",
    description: "",
    allocation_to: "team",
    team: "",
    member: "",
    priority: "Medium",
    due_date: "",
  };

  const [form, setForm] = useState(initialForm);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const { addTask } = useTasks();

  const dummyTeams = [
    { id: "team-a", name: "Team A" },
    { id: "team-b", name: "Team B" },
  ];

  const dummyMembers = {
    "team-a": [
      { id: "user1", name: "Alice" },
      { id: "user2", name: "Bob" },
    ],
    "team-b": [
      { id: "user3", name: "Charlie" },
      { id: "user4", name: "Diana" },
    ],
  };

  useEffect(() => {
    setTeams(dummyTeams);
  }, []);

  useEffect(() => {
    if (form.allocation_to === "member" && form.team) {
      setMembers(dummyMembers[form.team] || []);
    } else {
      setMembers([]);
    }
  }, [form.allocation_to, form.team]);

  const generateTaskID = async () => {
    try {
      const response = await axios.get("/api/task-main/");
      const tasks = response.data;

      const numbers = tasks
        .map((task) => {
          const match = task.id?.match(/^task(\d{3,})$/i);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((num) => num !== null && !isNaN(num));

      const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
      return `task${String(maxNumber + 1).padStart(3, "0")}`;
    } catch (error) {
      console.error("Failed to generate task ID:", error);
      return `task${String(Date.now()).slice(-3)}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      category: value,
      sub_category: "",
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.category || (form.allocation_to === "member" && !form.member)) {
      alert("⚠ Please fill all required fields.");
      return;
    }

    const taskId = await generateTaskID();
    const taskData = {
      id: taskId,
      ...form,
    };

    try {
      const response = await axios.post("/api/task-main/", taskData);
      console.log("Task created:", response.data);
      addTask(response.data);
      setForm(initialForm);
      alert("✅ Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("❌ Failed to create task. See console for details.");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
  };

  const categoryOptions = {
    Development: ["Frontend", "Backend", "DevOps"],
    Design: ["UI", "UX", "Branding"],
    Marketing: ["SEO", "Social Media", "Email Campaign"],
    HR: ["Recruitment", "Onboarding", "Policy Update"],
  };

  return (
    <div className="task-form-container">
      <h2>Create New Task</h2>

      <div className="form-group">
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {Object.keys(categoryOptions).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Sub Category</label>
        <select
          name="sub_category"
          value={form.sub_category}
          onChange={handleChange}
          disabled={!form.category}
        >
          <option value="">Select Sub Category</option>
          {(categoryOptions[form.category] || []).map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Assign To</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="allocation_to"
              value="team"
              checked={form.allocation_to === "team"}
              onChange={handleChange}
            />
            Team
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="allocation_to"
              value="member"
              checked={form.allocation_to === "member"}
              onChange={handleChange}
            />
            User
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Select Team</label>
        <select name="team" value={form.team} onChange={handleChange}>
          <option value="">Select Team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {form.allocation_to === "member" && (
        <div className="form-group">
          <label>Select User</label>
          <select name="member" value={form.member} onChange={handleChange}>
            <option value="">Select User</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Priority</label>
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="form-group">
        <label>Due Date</label>
        <input
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
        />
      </div>

      <div className="form-group" style={{ marginTop: "1rem" }}>
        <button onClick={handleSubmit}>Create</button>
        <button onClick={handleCancel} style={{ marginLeft: "1rem" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
