import React, { useContext, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Naye aur puraane components
const MagicLogin = React.lazy(() => import('./components/MagicLogin'));
const VerifyLogin = React.lazy(() => import('./components/VerifyLogin'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Feed = React.lazy(() => import('./components/Feed'));
const Notes = React.lazy(() => import('./components/Notes'));
// Baaki ke saare components bhi yahan import honge...

// Icons
import { House, BoxArrowRight } from 'react-bootstrap-icons';

const PrivateRoute = ({ children }) => { const { token } = useContext(AuthContext); return token ? children : <Navigate to="/login" />; };
const Loader = () => ( <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div> );

function AppContent() {
  const { token, logout } = useContext(AuthContext);
  return (
    <Router>
      {token && ( /* Navbar ka code same rahega */
        <nav className="navbar navbar-expand-lg bg-body shadow-sm sticky-top">
          <div className="container">
            <Link className="navbar-brand fs-4" to="/dashboard">CircleOne</Link>
            <div className="ms-auto d-flex align-items-center">
              <NavLink className="nav-link mx-2" to="/dashboard" title="Dashboard"><House size={22} /></NavLink>
              <button className="nav-link btn btn-link text-danger mx-2" onClick={logout} title="Logout"><BoxArrowRight size={22} /></button>
            </div>
          </div>
        </nav>
      )}
      <main className="container py-4">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<MagicLogin />} />
            <Route path="/verify-login" element={<VerifyLogin />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

function App() { return (<AuthProvider><AppContent /></AuthProvider>); }
export default App;
