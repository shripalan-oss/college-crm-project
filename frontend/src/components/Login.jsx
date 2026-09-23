import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', { email, password });
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{
            backgroundImage: "url('/images/bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.92)' }}>
                <div className="text-center mb-4">
                    <img src="/images/logo.jpg" alt="CRM Logo" style={{ width: '80px', borderRadius: '10px', marginBottom: '15px' }} />
                    <h2 style={{ color: '#004085', fontWeight: 'bold' }}>Student CRM Login</h2>
                    <p className="text-muted">Welcome back! Please login to your account.</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="student@university.edu" required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" placeholder="••••••••" required />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg" style={{ backgroundColor: '#004085' }}>Log In</button>
                    </div>
                </form>
                
                <div className="text-center mt-4">
                    <p>Don't have an account? <Link to="/register" style={{ color: '#004085', fontWeight: 'bold' }}>Register here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
