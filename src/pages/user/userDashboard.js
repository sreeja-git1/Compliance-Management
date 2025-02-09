import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import useAuth from '../auth/useAuth';

// User Dashboard Component
const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const { logout } = useAuth();
    const [notification, setNotification] = useState({ message: '', type: '' });
  
    useEffect(() => {
      fetchTasks();
    }, []);
  
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        showNotification(error.response?.data?.detail || 'Error fetching tasks', 'error');
      }
    };
  
    const showNotification = (message, type = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };
  
    const completeTask = async (taskId, file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(`/tasks/${taskId}/complete`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        fetchTasks();
        showNotification('Task completed successfully');
      } catch (error) {
        showNotification(error.response?.data?.detail || 'Error completing task', 'error');
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {notification.message && (
            <div className={`mb-4 p-4 rounded-lg ${
              notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {notification.message}
            </div>
          )}
  
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
  
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                      <td className="px-6 py-4">{task.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(task.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full
                          ${task.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.status !== 'completed' && (
                          <input
                            type="file"
                            onChange={(e) => completeTask(task.id, e.target.files[0])}
                            className="text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default UserDashboard;