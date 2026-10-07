import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ArrowLeft, UserPlus, CheckCircle, FileText, Download } from 'lucide-react';

const AdminApplicationDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appRes = await api.get(`/admin/applications/${id}`);
      setApp(appRes.data);
      
      const offRes = await api.get('/admin/officers');
      setOfficers(offRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAssign = async () => {
    if (!selectedOfficerId) return;
    try {
      await api.put(`/admin/applications/${id}/assign`, { officerId: selectedOfficerId });
      alert("Application assigned successfully.");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to assign application.");
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (!app) return <div className="alert alert-danger">Application not found.</div>;

  return (
    <div>
      <Link to="/admin/applications" className="btn btn-link text-decoration-none px-0 mb-3 text-muted">
        <ArrowLeft size={16} className="me-1"/> Back to Applications
      </Link>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-1">{app.serviceName}</h3>
              <p className="text-muted d-flex align-items-center gap-2 mb-4">
                Application Number: <span className="fw-bold text-dark">{app.applicationNumber}</span>
              </p>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="text-muted fw-bold mb-2">Citizen Information</h6>
                  <p className="mb-0 fw-medium">{app.citizenName}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted fw-bold mb-2">Application Status</h6>
                  <span className="badge bg-primary px-3 py-2 fs-6">{app.status.replace(/_/g, ' ')}</span>
                </div>
              </div>

              <h6 className="text-muted fw-bold border-bottom pb-2 mb-3">Form Data</h6>
              <div className="bg-light p-3 rounded">
                {app.formData && Object.entries(app.formData).map(([k, v]) => (
                  <div className="row mb-2" key={k}>
                    <div className="col-sm-4 text-muted text-capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="col-sm-8 fw-medium">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4 bg-primary text-white">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <UserPlus size={20}/> Officer Assignment
              </h5>
              <div className="mb-3">
                <label className="form-label small text-white-50">Current Assigned Officer</label>
                <div className="fw-bold fs-5">{app.assignedOfficer || "Unassigned"}</div>
              </div>
              
              <div className="bg-white p-3 rounded text-dark">
                <label className="form-label fw-bold small text-muted">Assign to new Officer</label>
                <select 
                  className="form-select mb-3" 
                  value={selectedOfficerId} 
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                >
                  <option value="">Select Officer...</option>
                  {officers.map(o => (
                    <option key={o.id} value={o.id}>{o.firstName} {o.lastName} ({o.username})</option>
                  ))}
                </select>
                <button 
                  onClick={handleAssign} 
                  className="btn btn-primary w-100 fw-bold"
                  disabled={!selectedOfficerId}
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationDetails;
