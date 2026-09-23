import { Link } from 'react-router-dom';

function Dashboard({ user }) {
    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card text-white p-4" style={{ backgroundColor: '#004085', borderRadius: '10px' }}>
                        <h2 className="mb-1">Welcome, {user.name}!</h2>
                        <p className="mb-0 fs-5"><i className="bi bi-building"></i> Organization: <strong>{user.tenant_id}</strong></p>
                    </div>
                </div>
            </div>

            <div className="row g-4 justify-content-center">
                {/* 2x2 Symmetrical Grid for core entities */}
                <div className="col-md-6 col-lg-6">
                    <div className="card h-100 text-center shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <h4 className="card-title text-primary mb-3"><i className="bi bi-people"></i> Donors & Insights</h4>
                            <p className="card-text text-muted mb-4">Manage your donors and analyze behavior patterns.</p>
                            <div className="d-flex gap-2 mt-auto">
                                <Link to="/donors" className="btn btn-outline-primary px-4">View Donors</Link>
                                <Link to="/donors/insights" className="btn btn-outline-warning px-4 text-dark">Insights</Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 col-lg-6">
                    <div className="card h-100 text-center shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <h4 className="card-title text-success mb-3"><i className="bi bi-flag"></i> Campaigns</h4>
                            <p className="card-text text-muted mb-4">Track ongoing fund raising campaigns.</p>
                            <Link to="/campaigns" className="btn btn-outline-success mt-auto px-4">View Campaigns</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-6">
                    <div className="card h-100 text-center shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <h4 className="card-title text-info mb-3"><i className="bi bi-cash-stack"></i> Donations</h4>
                            <p className="card-text text-muted mb-4">Monitor all donation transactions.</p>
                            <Link to="/donations" className="btn btn-outline-info mt-auto px-4">View Donations</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-6">
                    <div className="card h-100 text-center shadow-sm">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
                            <h4 className="card-title text-danger mb-3"><i className="bi bi-bullseye"></i> Outcomes</h4>
                            <p className="card-text text-muted mb-4">Track the real-world impact of your campaigns.</p>
                            <Link to="/outcomes" className="btn btn-outline-danger mt-auto px-4">View Outcomes</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-12 text-center">
                    <div className="card shadow-sm p-4 bg-light">
                        <h5>Project Status</h5>
                        <p className="mb-0 text-muted">This CRM system is a student project for Database Management Systems.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
