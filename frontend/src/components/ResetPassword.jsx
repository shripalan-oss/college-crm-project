import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    // Extract token from URL (e.g. ?token=...)
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError("No reset token found in the URL.");
            return;
        }
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/reset-password', { token, password });
            setMessage(res.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
            setMessage('');
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
            <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="text-center mb-4">
                    <h2 style={{ color: '#004085', fontWeight: 'bold' }}>Set New Password</h2>
                    <p className="text-muted">Please enter your new secure password.</p>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {!message && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-bold">New Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" placeholder="••••••••" required />
                        </div>
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary btn-lg" >Update Password</button>
                        </div>
                    </form>
                )}
                
                <div className="text-center mt-4">
                    <p><Link to="/login" style={{ color: '#004085', fontWeight: 'bold' }}>Back to Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;


