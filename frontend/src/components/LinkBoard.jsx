import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LinkBoard = () => {
  const { token } = useContext(AuthContext);
  const [links, setLinks] = useState([]);
  const [formData, setFormData] = useState({ title: '', url: '', description: '' });

  const { title, url, description } = formData;

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: { 'x-auth-token': token },
  });

  const getLinks = async () => {
    try {
      const res = await api.get('/links');
      setLinks(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) getLinks();
  }, [token]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onAddLink = async e => {
    e.preventDefault();
    try {
      await api.post('/links', formData);
      getLinks();
      setFormData({ title: '', url: '', description: '' });
    } catch (err) { console.error(err); }
  };

  const deleteLink = async (id) => {
    try {
      await api.delete(`/links/${id}`);
      getLinks();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Add Link Form */}
        <div className="col-md-4">
          <h2 className="mb-4">Add a New Link</h2>
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={onAddLink}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" name="title" value={title} onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">URL</label>
                  <input type="url" className="form-control" name="url" value={url} onChange={onChange} placeholder="https://example.com" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description (Optional)</label>
                  <textarea className="form-control" name="description" value={description} onChange={onChange} rows="3"></textarea>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Save Link</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Display Links */}
        <div className="col-md-8">
          <h2 className="mb-4">My Link Board</h2>
          <div className="row">
            {links.length > 0 ? (
              links.map(link => (
                <div key={link._id} className="col-md-6 mb-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">{link.title}</h5>
                      <p className="card-text">{link.description}</p>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Visit</a>
                      <button onClick={() => deleteLink(link._id)} className="btn btn-sm btn-outline-danger ms-2">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>You have no saved links yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkBoard;
