import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TaskUpdates.css"; // Create this CSS for styling

export default function TaskUpdates() {
  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState({
    task_main: "",
    updated_by: "",
    update_text: "",
  });
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/task-update/");
      setUpdates(res.data);
    } catch (err) {
      console.error("Error fetching updates:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/task-update/", newUpdate);
      setNewUpdate({ task_main: "", updated_by: "", update_text: "" });
      fetchUpdates();
    } catch (err) {
      console.error("Create failed:", err.response?.data || err);
    }
  };

  return (
    <div className="task-updates-container">
      <h2>Task Updates</h2>

      {/* New Update Form */}
      <form className="task-update-form" onSubmit={handleCreate}>
        <input
          name="task_main"
          placeholder="Task Main ID (e.g., TASK-001)"
          value={newUpdate.task_main}
          onChange={handleInputChange}
          required
        />
        <input
          name="updated_by"
          placeholder="Updated By"
          value={newUpdate.updated_by}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="update_text"
          placeholder="Update Text"
          value={newUpdate.update_text}
          onChange={handleInputChange}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>

      {/* Updates Grid */}
      <div className="updates-grid">
        {updates.map((u, index) => (
          <div
            key={index}
            className="update-card"
            onClick={() => setSelectedUpdate(u)}
          >
            <h4>{u.task_main}</h4>
            <p><strong>{u.updated_by}</strong></p>
            <p className="date">{new Date(u.updated_at).toLocaleString()}</p>
            <p className="text-snippet">{u.update_text}</p>
          </div>
        ))}
      </div>

      {/* Modal View */}
      {selectedUpdate && (
        <div className="modal-overlay" onClick={() => setSelectedUpdate(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Task: {selectedUpdate.task_main}</h3>
            <p><strong>Updated By:</strong> {selectedUpdate.updated_by}</p>
            <p><strong>Date:</strong> {new Date(selectedUpdate.updated_at).toLocaleString()}</p>
            <p><strong>Details:</strong></p>
            <p>{selectedUpdate.update_text}</p>
            <button onClick={() => setSelectedUpdate(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
