import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { FileText, Filter, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my');
      // Sort by latest first
      const sorted = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setApplications(sorted);
      setFilteredApps(sorted);
    } catch (err) {
      setError('Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredApps(applications);
    } else {
      setFilteredApps(applications.filter(app => app.status === filter));
    }
  }, [filter, applications]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'DRAFT': return <span className="badge bg-secondary">DRAFT</span>;
      case 'SUBMITTED': return <span className="badge bg-primary">SUBMITTED</span>;
      case 'UNDER_REVIEW': return <span className="badge bg-info text-dark">UNDER REVIEW</span>;
      case 'DOCUMENT_VERIFICATION': return <span className="badge bg-warning text-dark">DOC VERIFICATION</span>;
      case 'CORRECTION_REQUIRED': return <span className="badge bg-danger">CORRECTION REQUIRED</span>;
      case 'APPROVED': return <span className="badge bg-success">APPROVED</span>;
      case 'REJECTED': return <span className="badge bg-dark">REJECTED</span>;
      case 'COMPLETED': return <span className="badge bg-success"><CheckCircle size={12} className="me-1"/> COMPLETED</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container py-5 min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0 gradient-text">My Applications</h2>
        <Link to="/services" className="btn btn-outline-primary rounded-pill">Apply for New Service</Link>
      </div>

      <div className="row g-4">
        {/* Filters */}
        <div className="col-md-3">
          <div className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <Filter size={20} className="text-primary" />
              <h5 className="m-0 fw-bold">Filter Status</h5>
            </div>
            <div className="list-group list-group-flush gap-1">
              {['ALL', 'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFICATION', 'CORRECTION_REQUIRED', 'APPROVED', 'REJECTED', 'COMPLETED'].map(status => (
                <button 
                  key={status}
                  className={`list-group-item list-group-item-action rounded-3 border-0 ${filter === status ? 'active shadow-sm' : 'bg-transparent text-muted'}`}
                  onClick={() => setFilter(status)}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="col-md-9">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger"><AlertCircle className="me-2"/>{error}</div>
          ) : filteredApps.length === 0 ? (
            <div className="glass-card p-5 text-center">
              <FileText size={48} className="text-muted mb-3 opacity-50 mx-auto" />
              <h4 className="text-muted">No applications found</h4>
              <p className="text-muted small">You haven't applied for any services matching this status.</p>
              {filter !== 'ALL' && (
                <button className="btn btn-outline-primary rounded-pill mt-2" onClick={() => setFilter('ALL')}>Clear Filters</button>
              )}
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filteredApps.map(app => (
                <div key={app.id} className="glass-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 transition-hover">
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <span className="fw-bold text-dark">{app.applicationNumber}</span>
                      {getStatusBadge(app.status)}
                    </div>
                    <h5 className="fw-bold text-primary mb-1">{app.serviceName}</h5>
                    <p className="text-muted small mb-0">{app.departmentName}</p>
                  </div>
                  
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
                    <div className="text-md-end text-muted small">
                      <div><Clock size={14} className="me-1"/> Updated: {new Date(app.updatedAt).toLocaleDateString()}</div>
                      {app.submittedAt && <div>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</div>}
                    </div>
                    <Link to={`/applications/${app.id}`} className="btn btn-light border rounded-pill px-4 fw-medium shadow-sm hover-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
