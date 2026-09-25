import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({ org_name: '', name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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
            <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="text-center mb-4">
                    <h2 style={{ color: '#004085', fontWeight: 'bold' }}>Register Organization</h2>
                    <p className="text-muted">Create a new CRM workspace for your project group.</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Organization Name</label>
                        <input type="text" name="org_name" onChange={handleChange} className="form-control" placeholder="e.g. Group 5 Team" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Your Name</label>
                        <input type="text" name="name" onChange={handleChange} className="form-control" placeholder="John Doe" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email Address</label>
                        <input type="email" name="email" onChange={handleChange} className="form-control" placeholder="student@university.edu" required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" name="password" onChange={handleChange} className="form-control" placeholder="••••••••" required />
                    </div>
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg">Create Account</button>
                    </div>
                </form>
                
                <div className="text-center mt-4">
                    <p>Already have an account? <Link to="/login" style={{ color: '#004085', fontWeight: 'bold' }}>Log in here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;


