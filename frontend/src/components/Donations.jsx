import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Donations() {
    const [donations, setDonations] = useState([]);
    const [donors, setDonors] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [formData, setFormData] = useState({ donor_id: '', campaign_id: '', amount: '' });

    const fetchData = () => {
        axios.get(import.meta.env.VITE_API_URL + '/api/donations').then(res => setDonations(res.data)).catch(console.error);
        axios.get(import.meta.env.VITE_API_URL + '/api/donors').then(res => setDonors(res.data)).catch(console.error);
        axios.get(import.meta.env.VITE_API_URL + '/api/campaigns').then(res => setCampaigns(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/donations', formData);
            setFormData({ ...formData, amount: '' });
            fetchData();
        } catch (error) {
            console.error("Error adding donation", error);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><span className="text-info">Donations</span> Tracker</h2>
                <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
            </div>

            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card border-info">
                        <div className="card-header text-white bg-info">
                            Record New Donation
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Select Donor</label>
                                    <select name="donor_id" value={formData.donor_id} onChange={handleChange} className="form-select" required>
                                        <option value="">-- Select Donor --</option>
                                        {donors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Select Campaign (Optional)</label>
                                    <select name="campaign_id" value={formData.campaign_id} onChange={handleChange} className="form-select">
                                        <option value="">-- No Campaign --</option>
                                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Donation Amount ($)</label>
                                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="form-control" placeholder="100.00" step="0.01" required />
                                </div>
                                
                                <button type="submit" className="btn btn-info w-100 text-white fw-bold">Record Donation</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card border-info">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover mb-0">
                                    <thead className="table-info">
                                        <tr>
                                            <th>Donor</th>
                                            <th>Campaign</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.length > 0 ? donations.map(d => (
                                            <tr key={d.id}>
                                                <td className="fw-bold">{d.donor_name}</td>
                                                <td>
                                                    {d.campaign_name ? <span className="badge bg-secondary">{d.campaign_name}</span> : <span className="text-muted">-</span>}
                                                </td>
                                                <td className="text-success fw-bold">${d.amount.toFixed(2)}</td>
                                                <td>{d.date ? d.date.substring(0, 10) : ''}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted py-4">No donations recorded yet.</td>
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

export default Donations;
