import React, { useState, useEffect, useContext } from 'react';
import api from '../api'; // Nayi api file ko import kiya
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  const getMyProfile = async () => {
    try {
      const res = await api.get('/api/profile/me');
      setFollowing(res.data.profile.following.map(f => f.user));
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    if (token) {
      getMyProfile();
    }
  }, [token]);

  const onSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    try {
      const res = await api.get(`/api/profile?search=${searchQuery}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const followUser = async (id) => {
    try {
      await api.put(`/api/profile/follow/${id}`);
      getMyProfile(); // List ko refresh karo
    } catch (err) {
      alert(err.response?.data?.msg || 'Could not follow user');
    }
  };

  const unfollowUser = async (id) => {
    try {
      await api.put(`/api/profile/unfollow/${id}`);
      getMyProfile(); // List ko refresh karo
    } catch (err) {
      alert(err.response?.data?.msg || 'Could not unfollow user');
    }
  };

  const startConversation = async (receiverId) => {
    try {
      await api.post('/api/conversations', { receiverId });
      navigate('/chat');
    } catch (err) {
      console.error(err);
      alert('Could not start chat. Maybe it already exists.');
      navigate('/chat');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
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

        <div className="list-group">
          {users.map(user => {
            const isFollowing = following.includes(user._id);
            return (
              <div key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div 
                    className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center me-3" 
                    style={{ width: '40px', height: '40px' }}
                  >
                    {user.name.substring(0, 1)}
                  </div>
                  <strong>{user.name}</strong>
                </div>
                <div>
                  <button onClick={() => startConversation(user._id)} className="btn btn-outline-primary btn-sm me-2">Message</button>
                  <button 
                    onClick={() => isFollowing ? unfollowUser(user._id) : followUser(user._id)} 
                    className={`btn btn-sm ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
