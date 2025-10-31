import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api'; // Humne nayi api file ko import kiya
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { token, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => { if (token) navigate('/dashboard') }, [token, navigate]);
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // 'axios.post' ki jagah 'api.post' aur '/api/auth'
      const res = await api.post('/api/auth', { email: formData.email, password: formData.password });
      login(res.data.token);
    } catch (err) { setError(err.response?.data?.msg || 'Login failed!'); }
  };
  return ( /* ... Form ka poora JSX code same rahega ... */ );
};
export default Login;
