import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { exportTableToPDF } from '../utils/exportToPDF';

function Outcomes() {
    const [outcomes, setOutcomes] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [formData, setFormData] = useState({ campaign_id: '', description: '', metric_value: '' });
    const [errorMsg, setErrorMsg] = useState('');

    const fetchData = () => {
        axios.get(import.meta.env.VITE_API_URL + '/api/outcomes').then(res => setOutcomes(res.data)).catch(console.error);
        axios.get(import.meta.env.VITE_API_URL + '/api/campaigns').then(res => setCampaigns(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/outcomes', formData);
            setFormData({ ...formData, description: '', metric_value: '' });
            fetchData();
        } catch (error) {
            setErrorMsg(error.response?.data?.error || 'An error occurred'); console.error(error);
        }
    };

    const handleExport = () => {
        const columns = ['Campaign', 'Description', 'Metric Value'];
        const data = outcomes.map(o => [
            o.campaign_name || '-',
            o.description,
            o.metric_value
        ]);
        exportTableToPDF('Project Outcomes', columns, data, 'Outcomes');
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><span className="text-primary">Project</span> Outcomes</h2>
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
                            Record New Outcome
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Select Campaign</label>
                                    <select name="campaign_id" value={formData.campaign_id} onChange={handleChange} className="form-select" required>
                                        <option value="">-- Select Campaign --</option>
                                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Outcome Description</label>
                                    <input type="text" name="description" value={formData.description} onChange={handleChange} className="form-control" placeholder="e.g. Meals served, Trees planted" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Metric Value</label>
                                    <input type="number" name="metric_value" value={formData.metric_value} onChange={handleChange} className="form-control" placeholder="e.g. 50" step="0.01" required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Add Outcome</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover mb-0">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Campaign</th>
                                            <th>Description</th>
                                            <th>Metric Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {outcomes.length > 0 ? outcomes.map(o => (
                                            <tr key={o.id}>
                                                <td>
                                                    {o.campaign_name ? <span className="badge bg-secondary">{o.campaign_name}</span> : <span className="text-muted">-</span>}
                                                </td>
                                                <td>{o.description}</td>
                                                <td className="fw-bold text-capitalize">{o.metric_value}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted py-4">No outcomes recorded yet.</td>
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

export default Outcomes;


