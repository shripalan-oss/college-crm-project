import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { exportTableToPDF } from '../utils/exportToPDF';

function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [formData, setFormData] = useState({ name: '', goal_amount: '' });

    const fetchCampaigns = () => {
        axios.get(import.meta.env.VITE_API_URL + '/api/campaigns')
            .then(res => setCampaigns(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/campaigns', formData);
            setFormData({ name: '', goal_amount: '' });
            fetchCampaigns();
        } catch (error) {
            console.error("Error adding campaign", error);
        }
    };

    const handleExport = () => {
        const columns = ['Campaign Name', 'Goal Amount'];
        const data = campaigns.map(c => [
            c.name,
            c.goal_amount ? `₹${c.goal_amount.toFixed(2)}` : 'Not set'
        ]);
        exportTableToPDF('Campaigns Management', columns, data, 'Campaigns');
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><span className="fw-bold">Campaigns</span> Management</h2>
                <div>
                    <button onClick={handleExport} className="btn btn-outline-primary me-2 fw-bold">
                        <i className="bi bi-file-earmark-pdf me-1"></i> Export PDF
                    </button>
                    <Link to="/" className="btn btn-outline-primary">Back to Dashboard</Link>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card">
                        <div className="card-header fw-bold text-uppercase">
                            Create New Campaign
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Campaign Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="e.g. Annual Alumni Fund" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Goal Amount (₹)</label>
                                    <input type="number" name="goal_amount" value={formData.goal_amount} onChange={handleChange} className="form-control" placeholder="10000.00" step="0.01" />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Add Campaign</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Campaign Name</th>
                                            <th>Goal Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaigns.length > 0 ? campaigns.map(c => (
                                            <tr key={c.id}>
                                                <td className="fw-bold text-capitalize">{c.name}</td>
                                                <td>
                                                    {c.goal_amount ? `₹${c.goal_amount.toFixed(2)}` : <span className="text-muted">Not set</span>}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="2" className="text-center text-muted py-4">No campaigns found. Start one today!</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Campaigns;


