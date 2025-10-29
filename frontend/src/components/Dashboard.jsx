import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/profile/me', {
          headers: { 'x-auth-token': token },
        });
        setUserName(res.data.profile.name);
      } catch (err) { console.error(err); }
    };
    if (token) getProfile();
  }, [token]);

  return (
    <div className="container text-center mt-5 py-4">
      <h1 className="display-5 mb-3" style={{ fontWeight: 300 }}>
        Welcome back, <span className="fw-bold">{userName || 'User'}</span>
      </h1>
      <p className="lead text-muted mb-5">What would you like to do today?</p>
      <div className="row justify-content-center g-4">
        {/* Cards */}
        <DashboardCard link="/feed" emoji="🧠" title="Feed" />
        <DashboardCard link="/notes" emoji="📝" title="My Notes" />
        <DashboardCard link="/planner" emoji="🗓️" title="My Planner" />
        <DashboardCard link="/linkboard" emoji="🔗" title="Link Board" />
      </div>
    </div>
  );
};

// Chota sa helper component
const DashboardCard = ({ link, emoji, title }) => (
  <div className="col-12 col-md-6 col-lg-3">
    <Link to={link} className="text-decoration-none text-dark">
      <div className="card h-100 shadow-sm card-hover">
        <div className="card-body d-flex flex-column justify-content-center">
          <h2 className="display-1">{emoji}</h2>
          <h5 className="card-title mt-3">{title}</h5>
        </div>
      </div>
    </Link>
  </div>
);

export default Dashboard;
