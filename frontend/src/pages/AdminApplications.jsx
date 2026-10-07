import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Search, Filter, Eye, Calendar } from 'lucide-react';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [officerFilter, setOfficerFilter] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/admin/applications');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const officers = Array.from(new Set(applications.map(a => a.assignedOfficer).filter(Boolean)));

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    const matchesOfficer = officerFilter ? app.assignedOfficer === officerFilter : true;
    return matchesSearch && matchesStatus && matchesOfficer;
  });

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Application Management</h3>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="position-relative">
                <Search className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} size={18}/>
                <input 
                  type="text" 
                  className="form-control ps-5 bg-light border-0" 
                  placeholder="Search by ID, Service, Citizen..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select bg-light border-0" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="DOCUMENT_VERIFICATION">Document Verification</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select bg-light border-0" value={officerFilter} onChange={(e) => setOfficerFilter(e.target.value)}>
                <option value="">All Officers</option>
                <option value="UNASSIGNED">Unassigned</option>
                {officers.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4">ID / Service</th>
                <th>Citizen</th>
                <th>Assigned Officer</th>
                <th>Status</th>
                <th>Date</th>
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
                  <td>{app.citizenName}</td>
                  <td>{app.assignedOfficer || <span className="text-muted fst-italic">Unassigned</span>}</td>
                  <td>
                    <span className={`badge ${['APPROVED', 'COMPLETED'].includes(app.status) ? 'bg-success' : 'bg-primary'} rounded-pill`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
                  <td className="text-end px-4">
                    <Link to={`/admin/applications/${app.id}`} className="btn btn-sm btn-outline-primary">
                      <Eye size={14} className="me-1"/> View
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
