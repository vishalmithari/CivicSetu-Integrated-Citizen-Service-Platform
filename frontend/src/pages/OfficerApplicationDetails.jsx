import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ArrowLeft, CheckCircle, Clock, FileText, User, Hash, Briefcase, FileSignature, Edit, AlertCircle, XCircle, File, Download } from 'lucide-react';

const OfficerApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [docRemarks, setDocRemarks] = useState({});

  const fetchAppData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/officer/applications/${id}`);
      setApp(res.data);
      // Fetch documents (Re-use citizen endpoint but backend should secure it for officer too, or we can use the same endpoint if authorized)
      const docRes = await api.get(`/applications/${id}/documents`);
      setDocuments(docRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    if (['REJECTED', 'CORRECTION_REQUIRED'].includes(status) && !remarks) {
      alert("Remarks are required to reject or request correction.");
      return;
    }
    if (!window.confirm(`Are you sure you want to transition this application to ${status}?`)) return;
    
    try {
      await api.put(`/officer/applications/${id}/status`, { status, remarks });
      setRemarks('');
      fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status.");
    }
  };

  const handleDocAction = async (docId, action) => {
    const rmk = docRemarks[docId];
    if (['REJECT', 'CORRECTION_REQUIRED'].includes(action) && !rmk) {
      alert("Remarks are required to reject or request correction for a document.");
      return;
    }

    try {
      await api.put(`/officer/documents/${docId}/action`, { action, remarks: rmk });
      setDocRemarks({ ...docRemarks, [docId]: '' });
      fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to perform document action.");
    }
  };
  
  const handleDownloadDoc = async (docId, fileName) => {
    try {
      const response = await api.get(`/documents/${docId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download document.");
    }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!app) return <div className="container py-5"><div className="alert alert-danger">Application not found or unauthorized.</div></div>;

  return (
    <div className="container py-5 min-vh-100">
      <Link to="/officer/applications" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center">
        <ArrowLeft size={16} className="me-2" /> Back to Application Queue
      </Link>

      <div className="row g-4">
        {/* Main Details */}
        <div className="col-lg-8">
          <div className="glass-card p-5 mb-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill">
                  {app.departmentName}
                </span>
                <h3 className="fw-bold mb-1">{app.serviceName}</h3>
                <p className="text-muted d-flex align-items-center gap-2">
                  <Hash size={16}/> {app.applicationNumber}
                </p>
              </div>
              <div className="text-end">
                <div className="fw-bold px-3 py-2 rounded-pill bg-light border shadow-sm d-inline-block">
                  Status: <span className="text-primary">{app.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>

            <h5 className="fw-bold mb-3 border-bottom pb-2">Citizen Information & Form Data</h5>
            <div className="bg-light p-4 rounded-3 border mb-4">
              <div className="row mb-3 border-bottom pb-2">
                <div className="col-sm-4 text-muted fw-medium">Citizen Account</div>
                <div className="col-sm-8 text-dark">{app.citizenName}</div>
              </div>
              {app.formData && Object.entries(app.formData).map(([key, value]) => (
                <div className="row mb-3 border-bottom pb-2" key={key}>
                  <div className="col-sm-4 text-muted fw-medium text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="col-sm-8 text-dark">{value || 'N/A'}</div>
                </div>
              ))}
            </div>
            
            {app.remarks && (
              <div className="alert alert-warning shadow-sm">
                <h6 className="fw-bold text-warning mb-2"><AlertCircle size={16} className="me-1"/> Previous Remarks</h6>
                <p className="mb-0 text-dark">{app.remarks}</p>
              </div>
            )}
          </div>

          {/* Document Verification Section */}
          <div className="glass-card p-5 shadow-sm mb-4">
            <h5 className="fw-bold mb-1 border-bottom pb-3 d-flex align-items-center gap-2">
              <FileSignature size={20} className="text-primary"/> Document Verification
            </h5>

            <div className="table-responsive mt-4">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>File</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="fw-medium">{doc.documentType}</td>
                      <td>
                        <button onClick={() => handleDownloadDoc(doc.id, doc.originalFileName)} className="btn btn-sm btn-link p-0 text-start">
                          <File size={14} className="me-1"/> {doc.originalFileName}
                        </button>
                      </td>
                      <td>
                        <span className={`badge ${doc.status === 'VERIFIED' ? 'bg-success' : doc.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        {doc.status !== 'VERIFIED' && (
                          <div className="d-flex flex-column gap-2" style={{minWidth: '200px'}}>
                            <input 
                              type="text" 
                              className="form-control form-control-sm" 
                              placeholder="Remarks (if rejecting)..." 
                              value={docRemarks[doc.id] || ''}
                              onChange={(e) => setDocRemarks({...docRemarks, [doc.id]: e.target.value})}
                            />
                            <div className="d-flex gap-2">
                              <button onClick={() => handleDocAction(doc.id, 'VERIFY')} className="btn btn-sm btn-success w-100">Verify</button>
                              <button onClick={() => handleDocAction(doc.id, 'REJECT')} className="btn btn-sm btn-danger w-100">Reject</button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">No documents uploaded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="col-lg-4">
          <div className="glass-card p-4 shadow-sm sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-4">Application Actions</h5>
            
            <div className="mb-4">
              <label className="form-label text-muted small fw-bold">Update Status Remarks</label>
              <textarea 
                className="form-control bg-light" 
                rows="3" 
                placeholder="Reason for decision..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
            </div>

            <div className="d-grid gap-2">
              <button 
                onClick={() => handleUpdateStatus('DOCUMENT_VERIFICATION')} 
                className="btn btn-outline-primary"
                disabled={app.status !== 'SUBMITTED' && app.status !== 'CORRECTION_REQUIRED'}
              >
                Move to Doc Verification
              </button>
              
              <button 
                onClick={() => handleUpdateStatus('UNDER_REVIEW')} 
                className="btn btn-outline-info"
                disabled={app.status !== 'DOCUMENT_VERIFICATION'}
              >
                Move to Officer Review
              </button>
              
              <button 
                onClick={() => handleUpdateStatus('APPROVED')} 
                className="btn btn-success text-white shadow-sm"
                disabled={app.status !== 'UNDER_REVIEW'}
              >
                Approve Application
              </button>
              
              <button 
                onClick={() => handleUpdateStatus('REJECTED')} 
                className="btn btn-danger text-white shadow-sm"
                disabled={app.status === 'REJECTED' || app.status === 'COMPLETED'}
              >
                Reject Application
              </button>
              
              <button 
                onClick={() => handleUpdateStatus('CORRECTION_REQUIRED')} 
                className="btn btn-warning text-dark shadow-sm"
                disabled={app.status === 'COMPLETED'}
              >
                Request Correction
              </button>

              <button 
                onClick={() => handleUpdateStatus('COMPLETED')} 
                className="btn btn-dark text-white shadow-sm mt-3"
                disabled={app.status !== 'APPROVED'}
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerApplicationDetails;
