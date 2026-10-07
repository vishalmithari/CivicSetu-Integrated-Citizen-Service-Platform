import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h3 className="fw-bold mb-4 text-dark">Department Overview</h3>
      
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="glass-card border-0 shadow-sm h-100 p-4">
            <h6 className="text-uppercase fw-bold text-muted mb-2">Total Applications</h6>
            <h2 className="mb-0 fw-bold text-primary">{stats.totalApplications}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card border-0 shadow-sm h-100 p-4">
            <h6 className="text-uppercase fw-bold text-muted mb-2">Pending / Verification</h6>
            <h2 className="mb-0 fw-bold text-warning">{stats.pendingReview + stats.documentVerification}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card border-0 shadow-sm h-100 p-4">
            <h6 className="text-uppercase fw-bold text-muted mb-2">Total Officers</h6>
            <h2 className="mb-0 fw-bold text-info">{stats.totalOfficers}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card border-0 shadow-sm h-100 p-4">
            <h6 className="text-uppercase fw-bold text-muted mb-2">Completed</h6>
            <h2 className="mb-0 fw-bold text-success">{stats.completed}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="glass-card border-0 shadow-sm h-100 p-4">
            <h5 className="fw-bold pb-2 mb-3">Applications by Status</h5>
            <ul className="list-group list-group-flush bg-transparent">
              {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
                <li key={status} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-light">
                  <span className="text-muted fw-medium">{status.replace(/_/g, ' ')}</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">{count}</span>
                </li>
              ))}
              {Object.keys(stats.applicationsByStatus).length === 0 && (
                <li className="list-group-item px-0 text-muted bg-transparent border-light">No data available.</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="glass-card border-0 shadow-sm h-100 p-4">
            <h5 className="fw-bold pb-2 mb-3">Applications by Service</h5>
            <ul className="list-group list-group-flush bg-transparent">
              {Object.entries(stats.applicationsByService).map(([service, count]) => (
                <li key={service} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-light">
                  <span className="text-muted fw-medium">{service}</span>
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">{count}</span>
                </li>
              ))}
              {Object.keys(stats.applicationsByService).length === 0 && (
                <li className="list-group-item px-0 text-muted bg-transparent border-light">No data available.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
