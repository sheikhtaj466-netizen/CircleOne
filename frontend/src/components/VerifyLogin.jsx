import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const VerifyLogin = () => {
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token); // Token ko global state me save karo
      navigate('/dashboard'); // User ko dashboard par bhej do
    } else {
      // Agar link me token nahi hai, toh login page par bhej do
      navigate('/login');
    }
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Verifying...</span>
      </div>
      <h4 className="ms-3">Verifying your login...</h4>
    </div>
  );
};

export default VerifyLogin;
