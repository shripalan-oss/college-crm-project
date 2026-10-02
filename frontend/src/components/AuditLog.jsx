import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditLog() {
    const [logs, setLogs] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        axios.get(import.meta.env.VITE_API_URL + '/api/audit-log', { withCredentials: true })
            .then(res => setLogs(res.data))
            .catch(err => setErrorMsg(err.response?.data?.error || "Failed to load audit logs"));
    }, []);

    return (
        <div className="container mt-4">
            <h2>System Audit Log</h2>
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            <div className="card mt-3">
                <div className="card-body">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Entity</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.user_name}</td>
                                    <td>{log.action}</td>
                                    <td>{log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}</td>
                                    <td>{log.details}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && !errorMsg && <tr><td colSpan="5" className="text-center">No logs found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AuditLog;
