import { Link } from 'react-router-dom';

function Dashboard({ user }) {
    return (
        <div>
            <div className="row mb-5">
                <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1 fw-bold" style={{ textTransform: 'capitalize' }}>Welcome, {user.name}!</h2>
                            <p className="mb-0 fs-5 text-muted"><i className="bi bi-building me-2"></i> {user.tenant_id}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 justify-content-center">
                <div className="col-md-6 col-lg-6">
                    <div className="card h-100 text-center">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-5">
                            <div className="mb-4 text-primary" style={{ fontSize: '2.5rem' }}><i className="bi bi-people"></i></div>
                            <h4 className="card-title fw-bold mb-3">Donors & Insights</h4>
                            <p className="card-text text-muted mb-4">Manage your donors and analyze behavior patterns.</p>
                            <div className="d-flex gap-2 mt-auto">
                                <Link to="/donors" className="btn btn-primary px-4">View Donors</Link>
                                <Link to="/donors/insights" className="btn btn-outline-primary px-4">Insights</Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 col-lg-6">
                    <div className="card h-100 text-center">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-5">
                            <div className="mb-4 text-primary" style={{ fontSize: '2.5rem' }}><i className="bi bi-flag"></i></div>
                            <h4 className="card-title fw-bold mb-3">Campaigns</h4>
                            <p className="card-text text-muted mb-4">Track ongoing fund raising campaigns.</p>
                            <Link to="/campaigns" className="btn btn-primary mt-auto px-4">View Campaigns</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-6">
                    <div className="card h-100 text-center">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-5">
                            <div className="mb-4 text-primary" style={{ fontSize: '2.5rem' }}><i className="bi bi-cash-stack"></i></div>
                            <h4 className="card-title fw-bold mb-3">Donations</h4>
                            <p className="card-text text-muted mb-4">Monitor all donation transactions.</p>
                            <Link to="/donations" className="btn btn-primary mt-auto px-4">View Donations</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-6">
                    <div className="card h-100 text-center">
                        <div className="card-body d-flex flex-column justify-content-center align-items-center p-5">
                            <div className="mb-4 text-primary" style={{ fontSize: '2.5rem' }}><i className="bi bi-bullseye"></i></div>
                            <h4 className="card-title fw-bold mb-3">Outcomes</h4>
                            <p className="card-text text-muted mb-4">Track the real-world impact of your campaigns.</p>
                            <Link to="/outcomes" className="btn btn-primary mt-auto px-4">View Outcomes</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-12 text-center">
                    <p className="text-muted small">Collab CRM Platform • Internal Use Only</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;


