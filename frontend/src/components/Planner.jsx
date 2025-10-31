import React, { useState, useEffect, useContext } from 'react';
import api from '../api'; // Nayi api file ko import kiya
import { AuthContext } from '../context/AuthContext';

const Planner = () => {
  const { token } = useContext(AuthContext);
  // States for Tasks
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  // States for Habits
  const [habits, setHabits] = useState([]);
  const [habitText, setHabitText] = useState('');

  // --- TASKS LOGIC ---
  const getTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) { console.error("Error fetching tasks:", err); }
  };

  const onAddTask = async e => {
    e.preventDefault();
    try {
      await api.post('/api/tasks', { text: taskText });
      getTasks();
      setTaskText('');
    } catch (err) { console.error("Error adding task:", err); }
  };

  const toggleComplete = async (id) => {
    try {
      await api.put(`/api/tasks/${id}`);
      getTasks();
    } catch (err) { console.error("Error updating task:", err); }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      getTasks();
    } catch (err) { console.error("Error deleting task:", err); }
  };

  // --- HABITS LOGIC ---
  const getHabits = async () => {
    try {
      const res = await api.get('/api/habits');
      setHabits(res.data);
    } catch (err) { console.error("Error fetching habits:", err); }
  };

  const onAddHabit = async e => {
    e.preventDefault();
    try {
      await api.post('/api/habits', { name: habitText });
      getHabits();
      setHabitText('');
    } catch (err) { console.error("Error adding habit:", err); }
  };

  const trackHabit = async (id) => {
    try {
      await api.put(`/api/habits/track/${id}`);
      getHabits();
    } catch (err) { console.error("Error tracking habit:", err); }
  };

  useEffect(() => {
    if (token) {
      getTasks();
      getHabits();
    }
  }, [token]);

  const isHabitCompletedToday = (completions) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return completions.some(c => new Date(c.date).setHours(0, 0, 0, 0) === today);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        {/* Daily Planner Section */}
        <h2 className="text-center mb-4">My Daily Planner</h2>
        <div className="card shadow-sm mb-5">
          <div className="card-body">
            <form onSubmit={onAddTask} className="d-flex">
              <input type="text" className="form-control me-2" placeholder="Add a new task..." value={taskText} onChange={(e) => setTaskText(e.target.value)} required />
              <button className="btn btn-primary" type="submit">Add</button>
            </form>
          </div>
          <div className="list-group list-group-flush">
            {tasks.map(task => (
              <div key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span onClick={() => toggleComplete(task._id)} style={{ textDecoration: task.isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}>
                  {task.text}
                </span>
                <button onClick={() => deleteTask(task._id)} className="btn btn-sm btn-outline-danger">Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Tracker Section */}
        <h2 className="text-center mb-4">Habit Tracker</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={onAddHabit} className="d-flex">
              <input type="text" className="form-control me-2" placeholder="Add a new habit to track..." value={habitText} onChange={(e) => setHabitText(e.target.value)} required />
              <button className="btn btn-success" type="submit">Add</button>
            </form>
          </div>
          <div className="list-group list-group-flush">
            {habits.map(habit => (
              <div key={habit._id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{habit.name}</span>
                <button onClick={() => trackHabit(habit._id)} className={`btn btn-sm ${isHabitCompletedToday(habit.completions) ? 'btn-success' : 'btn-outline-secondary'}`}>
                  {isHabitCompletedToday(habit.completions) ? 'Done!' : 'Mark as Done'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
