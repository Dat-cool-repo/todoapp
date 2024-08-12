import { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const userId = localStorage.getItem('userId'); // Get the user ID from localStorage
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', { userId, description });
      setTasks([...tasks, response.data]);
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { completed: true });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Tasks</h2>
      <form onSubmit={handleAddTask} className="mb-6">
        <input
          type="text"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-2 bg-gray-700 text-white"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="bg-gray-700 p-4 mb-4 rounded-lg shadow-md">
            <span className={task.completed ? 'line-through' : ''}>{task.description} - {task.completed ? 'Completed' : 'Incomplete'}</span>
            <div className="mt-4">
              {!task.completed && (
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="bg-blue-500 text-white p-2 rounded mr-2"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
