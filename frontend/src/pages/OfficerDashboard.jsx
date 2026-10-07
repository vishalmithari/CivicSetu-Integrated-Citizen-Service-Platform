import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { BarChart2, CheckCircle, Clock, FileText, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

const OfficerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/officer/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!stats) return <div className="container py-5"><div className="alert alert-danger">Failed to load statistics.</div></div>;

  return (
    <div className="container py-5 min-vh-100">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1">Officer Dashboard</h2>
          <p className="text-muted mb-0">Overview of applications assigned to your department.</p>
        </div>
        <Link to="/officer/applications" className="btn btn-primary px-4 shadow-sm">View All Applications</Link>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="glass-card p-4 shadow-sm border-start border-4 border-primary h-100">
            <h6 className="text-muted fw-bold text-uppercase mb-2">Total Assigned</h6>
            <h2 className="fw-bold mb-0 text-primary">{stats.totalAssigned}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 shadow-sm border-start border-4 border-warning h-100">
            <h6 className="text-muted fw-bold text-uppercase mb-2">Pending Review</h6>
            <h2 className="fw-bold mb-0 text-warning">{stats.pendingReview}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 shadow-sm border-start border-4 border-info h-100">
            <h6 className="text-muted fw-bold text-uppercase mb-2">Doc Verification</h6>
            <h2 className="fw-bold mb-0 text-info">{stats.documentVerification}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 shadow-sm border-start border-4 border-success h-100">
            <h6 className="text-muted fw-bold text-uppercase mb-2">Completed</h6>
            <h2 className="fw-bold mb-0 text-success">{stats.completed}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="glass-card p-4 shadow-sm h-100">
            <h5 className="fw-bold mb-4 border-bottom pb-2">Applications by Status</h5>
            <ul className="list-group list-group-flush">
              {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
                <li key={status} className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-0 border-bottom">
                  <span className="fw-medium text-muted">{status.replace(/_/g, ' ')}</span>
                  <span className="badge bg-primary rounded-pill">{count}</span>
                </li>
              ))}
              {Object.keys(stats.applicationsByStatus).length === 0 && (
                <li className="list-group-item bg-transparent text-muted text-center border-0">No data available</li>
              )}
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card p-4 shadow-sm h-100">
            <h5 className="fw-bold mb-4 border-bottom pb-2">Applications by Service</h5>
            <ul className="list-group list-group-flush">
              {Object.entries(stats.applicationsByService).map(([service, count]) => (
                <li key={service} className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-0 border-bottom">
                  <span className="fw-medium text-muted">{service}</span>
                  <span className="badge bg-dark rounded-pill">{count}</span>
                </li>
              ))}
              {Object.keys(stats.applicationsByService).length === 0 && (
                <li className="list-group-item bg-transparent text-muted text-center border-0">No data available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
