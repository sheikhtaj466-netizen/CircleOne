import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // useNavigate ko import kiya

const AllUsers = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // useNavigate ko initialize kiya

  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: { 'x-auth-token': token },
  });

  // ... baaki ka onSearch function same rahega ...
  const onSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    try {
      const res = await api.get(`/profile?search=${searchQuery}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Naya function: Chat shuru karne ke liye
  const startConversation = async (receiverId) => {
      try {
          await api.post('/conversations', { receiverId });
          navigate('/chat'); // Conversation banne ke baad chat page par jao
      } catch (err) {
          console.error(err);
          alert('Could not start chat. Maybe it already exists.');
          navigate('/chat'); // Agar chat pehle se hai, toh bhi chat page par jao
      }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Search Form */}
          <h2 className="mb-4 text-center">Find Other Users</h2>
          <form onSubmit={onSearch} className="input-group mb-4 shadow-sm">
            <input 
              type="text" 
              className="form-control form-control-lg" 
              placeholder="Enter a name to search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>

          {/* Search Results */}
          <div className="list-group">
            {users.map(user => (
              <div key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                      {user.name.substring(0, 1)}
                  </div>
                  <strong>{user.name}</strong>
                </div>

                {/* Message Button (Naya) */}
                <div>
                    <button onClick={() => startConversation(user._id)} className="btn btn-outline-primary btn-sm">Message</button>
                    {/* Follow/Unfollow button ko abhi ke liye comment kar rahe hain */}
                    {/* <button className="btn btn-sm btn-secondary ms-2">Follow</button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
