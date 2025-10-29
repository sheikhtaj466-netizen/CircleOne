import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Notes = () => {
  const { token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const { title, content } = formData;

  // Function to fetch notes from backend
  const getNotes = async () => {
    const config = {
      headers: {
        'x-auth-token': token, // Gatekeeper (middleware) ke liye token bhejna
      },
    };
    try {
      const res = await axios.get('http://localhost:3001/api/notes', config);
      setNotes(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  // Jab component load hoga, notes fetch honge
  useEffect(() => {
    if (token) {
      getNotes();
    }
  }, [token]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Function to add a new note
  const onSubmit = async e => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };
    try {
      await axios.post('http://localhost:3001/api/notes', formData, config);
      getNotes(); // Naya note add hone ke baad list refresh karo
      setFormData({ title: '', content: '' }); // Form ko khali karo
    } catch (err) {
      console.error(err.response.data);
    }
  };

  // Function to delete a note
  const deleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
        const config = {
            headers: { 'x-auth-token': token },
        };
        try {
            await axios.delete(`http://localhost:3001/api/notes/${id}`, config);
            getNotes(); // Note delete hone ke baad list refresh karo
        } catch (err) {
            console.error(err.response.data);
        }
    }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Add Note Form */}
        <div className="col-md-4">
          <h2 className="mb-4">Add a New Note</h2>
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" name="title" value={title} onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea className="form-control" name="content" value={content} onChange={onChange} rows="4" required></textarea>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Add Note</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Display Notes */}
        <div className="col-md-8">
          <h2 className="mb-4">My Notes</h2>
          {notes.length > 0 ? (
            notes.map(note => (
              <div key={note._id} className="card shadow-sm mb-3">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.content}</p>
                    <small className="text-muted">
                      {new Date(note.date).toLocaleString()}
                    </small>
                  </div>
                  <button onClick={() => deleteNote(note._id)} className="btn btn-sm btn-danger">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>You have no notes yet. Add one!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
