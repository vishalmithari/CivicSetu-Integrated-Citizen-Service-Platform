import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Search, Filter, Eye, Hash, Calendar, FileText } from 'lucide-react';

const OfficerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  useEffect(() => {
    setStatusFilter(searchParams.get('status') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/officer/applications');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-5 min-vh-100">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1">Application Queue</h2>
          <p className="text-muted mb-0">Manage and process citizen applications.</p>
        </div>
      </div>

      <div className="glass-card p-4 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="position-relative">
              <Search className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} size={20}/>
              <input 
                type="text" 
                className="form-control ps-5 rounded-pill bg-light border-0" 
                placeholder="Search by ID or Service Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="position-relative">
              <Filter className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} size={20}/>
              <select 
                className="form-select ps-5 rounded-pill bg-light border-0"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="DOCUMENT_VERIFICATION">Document Verification</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="CORRECTION_REQUIRED">Correction Required</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">ID & Service</th>
                <th>Citizen</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr key={app.id}>
                  <td className="px-4">
                    <div className="fw-bold text-dark">{app.applicationNumber}</div>
                    <div className="small text-muted">{app.serviceName}</div>
                  </td>
                  <td>
                    <div className="fw-medium">{app.citizenName}</div>
                  </td>
                  <td>
                    <div className="small text-muted d-flex align-items-center gap-1">
                      <Calendar size={14}/> {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${['APPROVED', 'COMPLETED'].includes(app.status) ? 'bg-success' : ['REJECTED', 'CORRECTION_REQUIRED'].includes(app.status) ? 'bg-danger' : 'bg-primary'} rounded-pill`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="text-end px-4">
                    <Link to={`/officer/applications/${app.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                      <Eye size={14} className="me-1"/> Process
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">No applications found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficerApplications;
