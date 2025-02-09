import React, {useState, useEffect} from "react";
import axios from "axios";
import "../../styles/pages.css";
import { Typography,Button } from "@mui/material";

function CreateUser() {
    
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [newTask, setNewTask] = useState({
      title: '',
      description: '',
      due_date: '',
      assigned_to: ''
    });

      useEffect(() => {
        fetchTasks();
        fetchUsers();
      }, []);

      const fetchTasks = async () => {
        try {
          const response = await axios.get('/tasks');
          setTasks(response.data);
        } catch (error) {
          showNotification(error.response?.data?.detail || 'Error fetching tasks', 'error');
        }
      };
      const fetchUsers = async () => {
        try {
          const response = await axios.get('/admin/users');
          setUsers(response.data);
        } catch (error) {
          showNotification(error.response?.data?.detail || 'Error fetching users', 'error');
        }
      };
    
      const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      };

    const createTask = async (e) => {
      e.preventDefault();
      try {
        const taskData = {
          ...newTask,
          due_date: new Date(newTask.due_date).toISOString(),
          assigned_to: parseInt(newTask.assigned_to)
        };
        await axios.post('/tasks', taskData);
        setNewTask({ title: '', description: '', due_date: '', assigned_to: '' });
        fetchTasks();
        showNotification('Task created successfully');
      } catch (error) {
        showNotification(error.response?.data?.detail || 'Error creating task', 'error');
      }
    };

  return (
    <>
     <div className="form">
              <Typography variant="h5" className="bold center-align" >Create Task</Typography>
              <form onSubmit={createTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assign To</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newTask.assigned_to}
                    onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                  </select>
                </div>
                <Button
            color="primary" variant="contained" 
            className='w-full' type='submit'  >
                {/* // <button
                //   type="submit"
                //   className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                // > */}
                  Create Task
                </Button>
              </form>
            </div>
    </>
  );
}

export default CreateUser;
