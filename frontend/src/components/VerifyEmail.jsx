import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
    const [status, setStatus] = useState('Verifying...');
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    useEffect(() => {
        if (!token) {
            setStatus("No verification token provided.");
            return;
        }

        axios.post(import.meta.env.VITE_API_URL + '/api/auth/verify-email', { token })
            .then(res => {
                setStatus("Success! Your email has been verified. You can now log in.");
            })
            .catch(err => {
                setStatus(err.response?.data?.error || "Verification failed. The link may have expired.");
            });
    }, [token]);

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
            <div className="card text-center" style={{ maxWidth: '500px', width: '100%', padding: '40px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <h2 style={{ color: '#004085', fontWeight: 'bold' }}>Email Verification</h2>
                <div className="mt-4 mb-4 fs-5">
                    {status}
                </div>
                <Link to="/login" className="btn btn-primary btn-lg" >Go to Login</Link>
            </div>
        </div>
    );
}

export default VerifyEmail;


