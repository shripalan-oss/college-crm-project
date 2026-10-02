import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Donors from './components/Donors';
import Campaigns from './components/Campaigns';
import Donations from './components/Donations';
import Outcomes from './components/Outcomes';
import Insights from './components/Insights';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import AuditLog from './components/AuditLog';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios for credentials (cookies)
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    axios.get(import.meta.env.VITE_API_URL + '/api/auth/me')
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      {user && <Navbar user={user} setUser={setUser} />}
      <div className="container main-container">
        <Routes>
          <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" />} />
          <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/" />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/donors" element={user ? <Donors user={user} /> : <Navigate to="/login" />} />
          <Route path="/campaigns" element={user ? <Campaigns user={user} /> : <Navigate to="/login" />} />
          <Route path="/donations" element={user ? <Donations user={user} /> : <Navigate to="/login" />} />
          <Route path="/outcomes" element={user ? <Outcomes user={user} /> : <Navigate to="/login" />} />
          <Route path="/donors/insights" element={user ? <Insights user={user} /> : <Navigate to="/login" />} />
          <Route path="/audit-log" element={user && user.role === 'org-admin' ? <AuditLog /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <footer className="footer mt-auto">
        <div className="container">
          <span>&copy; 2026 Collab CRM - College Database Project</span>
        </div>
      </footer>
    </Router>
  );
}

export default App;
