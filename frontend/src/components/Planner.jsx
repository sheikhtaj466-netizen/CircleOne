import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Planner = () => {
  const { token } = useContext(AuthContext);
  // States for Tasks
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  // States for Habits
  const [habits, setHabits] = useState([]);
  const [habitText, setHabitText] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: { 'x-auth-token': token },
  });

  // --- TASKS LOGIC ---
  const getTasks = async () => { try { const res = await api.get('/tasks'); setTasks(res.data); } catch (err) { console.error(err); } };
  const onAddTask = async e => { e.preventDefault(); try { await api.post('/tasks', { text: taskText }); getTasks(); setTaskText(''); } catch (err) { console.error(err); } };
  const toggleComplete = async (id) => { try { await api.put(`/tasks/${id}`); getTasks(); } catch (err) { console.error(err); } };
  const deleteTask = async (id) => { try { await api.delete(`/tasks/${id}`); getTasks(); } catch (err) { console.error(err); } };

  // --- HABITS LOGIC ---
  const getHabits = async () => { try { const res = await api.get('/habits'); setHabits(res.data); } catch (err) { console.error(err); } };
  const onAddHabit = async e => { e.preventDefault(); try { await api.post('/habits', { name: habitText }); getHabits(); setHabitText(''); } catch (err) { console.error(err); } };
  const trackHabit = async (id) => { try { await api.put(`/habits/track/${id}`); getHabits(); } catch (err) { console.error(err); }};

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
    <div className="container mt-4">
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
                  <span onClick={() => toggleComplete(task._id)} style={{ textDecoration: task.isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}>{task.text}</span>
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
    </div>
  );
};

export default Planner;
