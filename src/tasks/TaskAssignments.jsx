import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskAssignments({ taskMainId }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    team: "",
    assignedTo: "",
    assignedBy: "",
    status: "New",
  });
  const API_BASE = "http://localhost:8000/api"; // adjust if needed

  // Fetch assignments on load or when taskMainId changes
  useEffect(() => {
    if (!taskMainId) return;
    setLoading(true);
    axios
      .get(`${API_BASE}/task-assignment/`, { params: { task_main: taskMainId } })
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Failed to fetch assignments", err))
      .finally(() => setLoading(false));
  }, [taskMainId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssign = async () => {
    if (!form.team || !form.assignedBy) {
      alert("Please enter at least team and assignedBy");
      return;
    }
    if (!taskMainId) {
      alert("No task selected");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        task_main: taskMainId,
        team: form.team,
        assigned_to: form.assignedTo,
        assigned_by: form.assignedBy,
        status: form.assignedTo ? "Assigned" : "New",
      };

      const res = await axios.post(`${API_BASE}/task-assignment/`, payload);
      setAssignments((prev) => [...prev, res.data]);
      setForm({
        team: "",
        assignedTo: "",
        assignedBy: "",
        status: "New",
      });
    } catch (err) {
      console.error("Assignment creation failed", err);
      alert("Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/task-assignment/${id}/`);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete assignment", err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-column">
      <h2>📌 Assignment Info</h2>

      {loading && <p>Loading...</p>}

      <div className="form-grid" style={{ marginBottom: "1rem" }}>
        <label>
          Team:
          <input type="text" name="team" value={form.team} onChange={handleChange} />
        </label>

        <label>
          Assigned To (optional):
          <input
            type="text"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
          />
        </label>

        <label>
          Assigned By:
          <input
            type="text"
            name="assignedBy"
            value={form.assignedBy}
            onChange={handleChange}
          />
        </label>

        <button type="button" onClick={handleAssign} disabled={loading}>
          ➕ Assign
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Assigned Team</th>
            <th>Assigned To</th>
            <th>Assigned By</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No assignments found
              </td>
            </tr>
          ) : (
            assignments.map((a, index) => (
              <tr key={a.id}>
                <td>{index + 1}</td>
                <td>{a.team}</td>
                <td>{a.assigned_to || "-"}</td>
                <td>{a.assigned_by}</td>
                <td>{new Date(a.assigned_at || a.created_at).toLocaleString()}</td>
                <td>{a.status}</td>
                <td>
                  <button
                    onClick={() => handleDelete(a.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                    }}
                    title="Delete"
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
