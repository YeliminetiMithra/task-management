import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Needed if user info is required elsewhere
import { useTasks } from '../context/TaskContext';

export default function TeamTasksTable() {
  const { user: currentUser } = useAuth(); // Optional - not used for filtering right now
  const { tasks } = useTasks();

  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const filtered = tasks.filter(
      (task) =>
        task.allocation_to?.toLowerCase() === 'team' &&
        (filter === 'All' || task.status === filter)
    );
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  return (
    <div className="task-table-container">
      <h2>Team Tasks</h2>

      <div className="filter-container" style={{ marginBottom: '1rem' }}>
        <label htmlFor="statusFilter">Filter by status: </label>
        <select
          id="statusFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <table className="task-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Team</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.team}</td>
                <td>{task.priority}</td>
                <td>{task.due_date}</td>
                <td>{task.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No team tasks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
