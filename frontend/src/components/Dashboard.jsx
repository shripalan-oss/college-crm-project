import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        axios.get(import.meta.env.VITE_API_URL + '/api/analytics/summary', { withCredentials: true })
            .then(res => setAnalytics(res.data))
            .catch(console.error);
        
        const now = new Date();
        setMonth(now.getMonth() + 1);
        setYear(now.getFullYear());
    }, []);

    const downloadReport = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_URL + `/api/reports/monthly?month=${month}&year=${year}`, {
                withCredentials: true,
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report_${year}_${month}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    if (!analytics) return <div className="text-center mt-5">Loading...</div>;

    const lineData = {
        labels: analytics.donations_by_date.map(d => d.date),
        datasets: [{ label: 'Donations Over Time', data: analytics.donations_by_date.map(d => d.amount), borderColor: 'rgba(75,192,192,1)', fill: false }]
    };

    const barData = {
        labels: analytics.campaign_totals.map(c => c.name),
        datasets: [{ label: 'Amount Raised', data: analytics.campaign_totals.map(c => c.amount), backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
    };

    const pieData = {
        labels: analytics.top_donors.map(d => d.name),
        datasets: [{
            label: 'Top Donors',
            data: analytics.top_donors.map(d => d.amount),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Dashboard</h2>
                <div className="d-flex gap-2">
                    <input type="number" value={month} onChange={e => setMonth(e.target.value)} className="form-control form-control-sm" style={{width: '70px'}} min="1" max="12" />
                    <input type="number" value={year} onChange={e => setYear(e.target.value)} className="form-control form-control-sm" style={{width: '90px'}} />
                    <button className="btn btn-sm btn-primary" onClick={downloadReport}>Download Monthly Report</button>
                </div>
            </div>
            
            <div className="row mb-4">
                <div className="col-md-3"><div className="card text-center p-3"><h5>Total Raised</h5><h3>${analytics.total_raised.toFixed(2)}</h3></div></div>
                <div className="col-md-3"><div className="card text-center p-3"><h5>Donors</h5><h3>{analytics.donor_count}</h3></div></div>
                <div className="col-md-3"><div className="card text-center p-3"><h5>Campaigns</h5><h3>{analytics.campaign_count}</h3></div></div>
                <div className="col-md-3"><div className="card text-center p-3"><h5>Donations</h5><h3>{analytics.donation_count}</h3></div></div>
            </div>

            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card p-3">
                        <h5>Donation Trends</h5>
                        <Line data={lineData} />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card p-3">
                        <h5>Campaign Performance</h5>
                        <Bar data={barData} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <h5>Top 5 Donors</h5>
                        <div style={{height: '300px', display: 'flex', justifyContent: 'center'}}>
                            <Pie data={pieData} options={{maintainAspectRatio: false}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
