import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/auth/logout');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src="/images/logo.jpg" alt="Logo" width="40" height="40" className="d-inline-block align-text-top me-2" style={{ borderRadius: '5px' }} />
                    Collab CRM
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/donors">Donors</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/campaigns">Campaigns</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/donations">Donations</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/outcomes">Outcomes</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/donors/insights">Insights</Link>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;


