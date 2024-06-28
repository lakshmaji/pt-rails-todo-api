// TaskList.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthProvider";

const TaskList = () => {
  const { authState } = useAuth();
  const { accessToken } = authState;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:3001/v1/tasks", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchTasks();
    }
  }, [accessToken]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.data?.map((task) => (
          <li key={task.id}>{task.attributes.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
