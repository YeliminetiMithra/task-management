import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskAttachments({ taskMainId }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    document_title: "",
    file: null,
    remarks: "",
  });
  const API_BASE = "http://localhost:8000/api"; // adjust if needed

  // Fetch attachments on component mount or taskMainId change
  useEffect(() => {
    if (!taskMainId) return;
    setLoading(true);
    axios
      .get(`${API_BASE}/task-attachment/`, { params: { task_main: taskMainId } })
      .then((res) => setAttachments(res.data))
      .catch((err) => console.error("Failed to fetch attachments", err))
      .finally(() => setLoading(false));
  }, [taskMainId]);

  // Handle file selection
  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.document_title || !form.file) {
      alert("Please enter document title and select a file.");
      return;
    }
    if (!taskMainId) {
      alert("No task selected for attachment.");
      return;
    }

    const formData = new FormData();
    formData.append("task_main", taskMainId);
    formData.append("file", form.file);
    formData.append("remarks", form.remarks || "");
    formData.append("document_title", form.document_title); // optional if you want

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/task-attachment/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Append new attachment from response
      setAttachments((prev) => [...prev, res.data]);
      setForm({ document_title: "", file: null, remarks: "" });
      setShowPopup(false);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload attachment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-attachments">
      <h3>📎 Task Attachments</h3>

      {loading && <p>Loading...</p>}

      <table>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Document Title</th>
            <th>File</th>
            <th>Remarks</th>
            <th>Uploaded At</th>
          </tr>
        </thead>
        <tbody>
          {attachments.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No attachments found
              </td>
            </tr>
          ) : (
            attachments.map((att, index) => (
              <tr key={att.id || index}>
                <td>{index + 1}</td>
                <td>{att.document_title || att.file_name || "N/A"}</td>
                <td>
                  <a
                    href={att.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {att.file.split("/").pop()}
                  </a>
                </td>
                <td>{att.remarks || "-"}</td>
                <td>{new Date(att.uploaded_at || att.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={() => setShowPopup(true)}>📂 Attach a File</button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h4>Attach New File</h4>
            <form onSubmit={handleSubmit}>
              <label>Document Title</label>
              <input
                type="text"
                name="document_title"
                value={form.document_title}
                onChange={handleInputChange}
                required
              />

              <label>File</label>
              <input type="file" onChange={handleFileChange} required />

              <label>Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleInputChange}
              />

              <div className="actions">
                <button type="submit" disabled={loading}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
