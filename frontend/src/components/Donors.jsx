import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { exportTableToPDF } from '../utils/exportToPDF';

function Donors() {
    const [donors, setDonors] = useState([]);
    const [formData, setFormData] = useState({ name: '', contact: '', tags: '' });

    const fetchDonors = () => {
        axios.get(import.meta.env.VITE_API_URL + '/api/donors')
            .then(res => setDonors(res.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(import.meta.env.VITE_API_URL + '/api/donors', formData);
            setFormData({ name: '', contact: '', tags: '' });
            fetchDonors();
        } catch (error) {
            console.error("Error adding donor", error);
        }
    };

    const handleExport = () => {
        const columns = ['Name', 'Contact', 'Tags'];
        const data = donors.map(d => [
            d.name,
            d.contact,
            d.tags || '-'
        ]);
        exportTableToPDF('Donors Directory', columns, data, 'Donors');
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><span className="text-primary">Donors</span> Directory</h2>
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
                        <div className="card-header fw-bold text-uppercase" >
                            Add New Donor
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Donor Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="e.g. John Doe" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Contact Info</label>
                                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="form-control" placeholder="Email or Phone number" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Tags</label>
                                    <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="form-control" placeholder="e.g. major, recurring" />
                                    <div className="form-text">Separate tags with commas.</div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Add Donor</button>
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
                                            <th>Name</th>
                                            <th>Contact</th>
                                            <th>Tags</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donors.length > 0 ? donors.map(donor => (
                                            <tr key={donor.id}>
                                                <td className="fw-bold text-capitalize">{donor.name}</td>
                                                <td>{donor.contact}</td>
                                                <td>
                                                    {donor.tags ? <span className="badge bg-secondary">{donor.tags}</span> : <span className="text-muted">-</span>}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted py-4">No donors found. Add a donor to get started.</td>
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

export default Donors;


