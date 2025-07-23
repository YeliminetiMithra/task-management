import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);

// Set Axios base URL
axios.defaults.baseURL = "http://localhost:8000"; // Update if different

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/task-main/");
      setTasks(response.data || []); // Fallback to empty array
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = (taskData) => {
    const id = `TASK-${Date.now()}`;
    const newTask = {
      task_main_ID: id,
      status: taskData.assignee ? "Assigned" : "New",
      ...taskData,
      attachments: [],
      updates: [],
      assignments: [],
      statusTrack: [],
    };
    setTasks((prev) => [...prev, newTask]);
    setCurrentTask(newTask);
  };

  const updateTask = (field, value) => {
    if (!currentTask) return;
    const updatedTask = { ...currentTask, [field]: value };
    setCurrentTask(updatedTask);
    setTasks((prev) =>
      prev.map((t) =>
        t.task_main_ID === currentTask.task_main_ID ? updatedTask : t
      )
    );
  };

  const addAttachment = (attachment) => {
    if (!currentTask) return;
    updateTask("attachments", [...(currentTask.attachments || []), attachment]);
  };

  const addUpdate = (update) => {
    if (!currentTask) return;
    updateTask("updates", [...(currentTask.updates || []), update]);
  };

  const addAssignment = (assignment) => {
    if (!currentTask) return;
    updateTask("assignments", [...(currentTask.assignments || []), assignment]);
  };

  const addStatusTrack = (statusEntry) => {
    if (!currentTask) return;
    updateTask("statusTrack", [...(currentTask.statusTrack || []), statusEntry]);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        reloadTasks: fetchTasks,
        addTask,
        currentTask,
        updateTask,
        addAttachment,
        addUpdate,
        addAssignment,
        addStatusTrack,
        setCurrentTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
