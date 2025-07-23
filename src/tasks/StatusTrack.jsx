import React, { useEffect, useState } from "react";

export default function StatusTrack({ taskId }) {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/task-status-track/?task_id=${taskId}`);
        if (!res.ok) throw new Error("Failed to fetch status history");
        const data = await res.json();
        setStatusData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [taskId]);

  return (
    <div className="task-column">
      <h2>📋 Status Track</h2>

      {loading && <p>Loading status history...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Date & Time</th>
              <th>From Status</th>
              <th>To Status</th>
              <th>Updated By</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {statusData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No status history
                </td>
              </tr>
            ) : (
              statusData.map((row, index) => (
                <tr key={row.id || index}>
                  <td>{index + 1}</td>
                  <td>{new Date(row.datetime || row.updated_at).toLocaleString()}</td>
                  <td>{row.from_status}</td>
                  <td>{row.to_status}</td>
                  <td>{row.updated_by}</td>
                  <td>{row.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
