import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/forgot-password', { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset link');
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
                    <h2 style={{ color: '#004085', fontWeight: 'bold' }}>Forgot Password</h2>
                    <p className="text-muted">Enter your email and we will send you a reset link.</p>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="student@university.edu" required />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg" >Send Reset Link</button>
                    </div>
                </form>
                
                <div className="text-center mt-4">
                    <p><Link to="/login" style={{ color: '#004085', fontWeight: 'bold' }}>Back to Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;


