import React, { useContext, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Saare Components
const Login = React.lazy(() => import('./components/Login'));
const Signup = React.lazy(() => import('./components/Signup'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Feed = React.lazy(() => import('./components/Feed'));
const Notes = React.lazy(() => import('./components/Notes'));
const Planner = React.lazy(() => import('./components/Planner'));
const Profile = React.lazy(() => import('./components/Profile'));
const AllUsers = React.lazy(() => import('./components/AllUsers'));
const LinkBoard = React.lazy(() => import('./components/LinkBoard'));
const Chat = React.lazy(() => import('./components/Chat'));

// Icons
import { House, BoxArrowRight, JournalText, ListCheck, People, PersonCircle, ChatDots, Link45deg } from 'react-bootstrap-icons';

const PrivateRoute = ({ children }) => { const { token } = useContext(AuthContext); return token ? children : <Navigate to="/login" />; };
const Loader = () => ( <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div> );

function AppContent() {
  const { token, logout } = useContext(AuthContext);
  return (
    <Router>
      {token && (
        <nav className="navbar navbar-expand-lg bg-body shadow-sm sticky-top">
          <div className="container">
            <Link className="navbar-brand fs-4" to="/dashboard">CircleOne</Link>
            <div className="ms-auto d-flex align-items-center">
              <NavLink className="nav-link mx-2" to="/dashboard" title="Dashboard"><House size={22} /></NavLink>
              <NavLink className="nav-link mx-2" to="/feed" title="Feed">Feed</NavLink>
              {/* --- YAHAN PAR BADLAAV KIYA GAYA HAI --- */}                                                                                                         <NavLink className="nav-link mx-2" to="/chat" title="Wappy">Wappy🍉</NavLink>
              {/* ------------------------------------- */}
              <NavLink className="nav-link mx-2" to="/users" title="Find Users"><People size={22} /></NavLink>
              <NavLink className="nav-link mx-2" to="/profile" title="My Profile"><PersonCircle size={22} /></NavLink>
              <button className="nav-link btn btn-link text-danger mx-2" onClick={logout} title="Logout"><BoxArrowRight size={22} /></button>
            </div>
          </div>
        </nav>
      )}
      <main className="container py-4">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
            <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
            <Route path="/planner" element={<PrivateRoute><Planner /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><AllUsers /></PrivateRoute>} />
            <Route path="/linkboard" element={<PrivateRoute><LinkBoard /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

function App() { return (<AuthProvider><AppContent /></AuthProvider>); }
export default App;
