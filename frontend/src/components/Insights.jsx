import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Insights() {
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        axios.get(import.meta.env.VITE_API_URL + '/api/donors/insights')
            .then(res => setInsights(res.data))
            .catch(console.error);
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><span className="text-warning">Donor</span> Intelligence (RFM)</h2>
                <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
            </div>

            <div className="card border-warning mb-4">
                <div className="card-body bg-light">
                    <h5 className="card-title">Recency, Frequency, Monetary (RFM) Analysis</h5>
                    <p className="card-text text-muted">This algorithmic analysis helps identify active vs lapsing donors based on their donation history patterns.</p>
                </div>
            </div>

            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-warning">
                                <tr>
                                    <th>Donor Name</th>
                                    <th>Last Donation Date</th>
                                    <th>Days Since Last</th>
                                    <th>Frequency (Count)</th>
                                    <th>Total Given ($)</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {insights.length > 0 ? insights.map(i => (
                                    <tr key={i.id} className={i.status === 'Lapsing' ? 'table-danger' : (i.status === 'Active' ? 'table-success' : '')}>
                                        <td className="fw-bold">{i.name}</td>
                                        <td>{i.last_donation || 'N/A'}</td>
                                        <td>{i.days_since !== null ? i.days_since : 'N/A'}</td>
                                        <td>{i.frequency}</td>
                                        <td className="fw-bold">${i.total_given.toFixed(2)}</td>
                                        <td>
                                            {i.status === 'Lapsing' && <span className="badge bg-danger">Lapsing</span>}
                                            {i.status === 'Active' && <span className="badge bg-success">Active</span>}
                                            {i.status !== 'Lapsing' && i.status !== 'Active' && <span className="badge bg-secondary">{i.status}</span>}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">No insights available. Add donations to generate insights.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Insights;
