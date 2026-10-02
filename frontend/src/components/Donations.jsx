import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { exportTableToPDF } from '../utils/exportToPDF';

function Donations({ user }) {
    const [donations, setDonations] = useState([]);
    const [donors, setDonors] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [formData, setFormData] = useState({ donor_id: '', campaign_id: '', amount: '' });
    const [errorMsg, setErrorMsg] = useState('');

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
            setErrorMsg('');
            fetchData();
        } catch (error) {
            setErrorMsg(error.response?.data?.error || "Error adding donation");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this donation?")) return;
        try {
            await axios.delete(import.meta.env.VITE_API_URL + `/api/donations/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const advanceStatus = async (id) => {
        try {
            await axios.put(import.meta.env.VITE_API_URL + `/api/donations/${id}/status`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const downloadReceipt = async (id) => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + `/api/donations/${id}/receipt`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
        }
    }

    const handleExport = () => {
        const columns = ['Donor', 'Campaign', 'Amount', 'Date', 'Status'];
        const data = donations.map(d => [
            d.donor_name,
            d.campaign_name || '-',
            `$${d.amount.toFixed(2)}`,
            d.date ? d.date.substring(0, 10) : '',
            d.status || 'Pending'
        ]);
        exportTableToPDF('Donations Tracker', columns, data, 'Donations');
    };

    const getStatusBadge = (status) => {
        status = status || "Pending";
        if (status === "Pending") return <span className="badge bg-warning text-dark">Pending</span>;
        if (status === "Verified") return <span className="badge bg-info">Verified</span>;
        return <span className="badge bg-success">Receipted</span>;
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><span className="fw-bold">Donations</span> Tracker</h2>
                <div>
                    <button onClick={handleExport} className="btn btn-outline-primary me-2 fw-bold">
                        <i className="bi bi-file-earmark-pdf me-1"></i> Export PDF
                    </button>
                    <Link to="/" className="btn btn-outline-primary">Back to Dashboard</Link>
                </div>
            </div>
            
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="card">
                        <div className="card-header fw-bold text-uppercase">
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
                                
                                <button type="submit" className="btn btn-primary w-100 text-white fw-bold">Record Donation</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="card">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Donor</th>
                                            <th>Campaign</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.length > 0 ? donations.map(d => (
                                            <tr key={d.id}>
                                                <td className="fw-bold text-capitalize">{d.donor_name}</td>
                                                <td>
                                                    {d.campaign_name ? <span className="badge bg-secondary">{d.campaign_name}</span> : <span className="text-muted">-</span>}
                                                </td>
                                                <td className="fw-bold fw-bold">${d.amount.toFixed(2)}</td>
                                                <td>{d.date ? d.date.substring(0, 10) : ''}</td>
                                                <td>{getStatusBadge(d.status)}</td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button onClick={() => downloadReceipt(d.id)} className="btn btn-outline-secondary" title="Download Receipt">⬇️</button>
                                                        {user?.role === 'org-admin' && (d.status || 'Pending') !== 'Receipted' && (
                                                            <button onClick={() => advanceStatus(d.id)} className="btn btn-outline-success" title="Advance Status">➡️</button>
                                                        )}
                                                        {user?.role === 'org-admin' && (
                                                            <button onClick={() => handleDelete(d.id)} className="btn btn-outline-danger" title="Delete">❌</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-4">No donations recorded yet.</td>
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
