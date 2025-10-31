import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { token, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => { if (token) navigate('/dashboard'); }, [token, navigate]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/auth', { email: formData.email, password: formData.password });
      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed!');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Welcome Back!</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={onChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={onChange} required />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
              </form>
              <div className="text-center mt-3">
                <p>Don't have an account? <Link to="/signup">Signup here</Link></p>
                {/* --- YAHAN PAR NAYA LINK ADD KIYA GAYA HAI --- */}
                <Link to="/forgot-password" style={{textDecoration: 'none'}}>Forgot Password?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
