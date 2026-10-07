import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ArrowLeft, CheckCircle, Clock, FileText, User, Hash, Briefcase, FileSignature, Edit, UploadCloud, XCircle, AlertCircle, File, Download, Trash2 } from 'lucide-react';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [service, setService] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchAppData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/applications/${id}`);
      const appData = res.data;
      setApp(appData);
      
      const [servRes, docRes] = await Promise.all([
        api.get(`/services/${appData.serviceId}`),
        api.get(`/applications/${id}/documents`)
      ]);
      setService(servRes.data);
      setDocuments(docRes.data);
    } catch (err) {
      setError('Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, [id]);

  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only PDF, JPG, and PNG are allowed.");
      return;
    }

    setUploadingDocType(docType);
    const formData = new FormData();
    formData.append('documentType', docType);
    formData.append('file', file);

    try {
      await api.post(`/applications/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed.");
    } finally {
      setUploadingDocType(null);
      setUploadProgress(0);
      e.target.value = null; // reset input
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/documents/${docId}`);
      fetchAppData();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed.");
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
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!app || !service) return null;

  // Compute active step based on status
  let activeStep = 0;
  if (app.status === 'DRAFT') activeStep = -1;
  else if (app.status === 'SUBMITTED') activeStep = 0;
  else if (app.status === 'DOCUMENT_VERIFICATION') activeStep = 1;
  else if (app.status === 'UNDER_REVIEW') activeStep = 2;
  else if (['APPROVED', 'REJECTED', 'CORRECTION_REQUIRED'].includes(app.status)) activeStep = 3;
  else if (app.status === 'COMPLETED') activeStep = 4;

  const steps = ["Submitted", "Doc Verification", "Officer Review", "Decision", "Completed"];

  // Helper to render document status
  const getDocStatusBadge = (status) => {
    switch(status) {
      case 'UPLOADED': return <span className="badge bg-primary">UPLOADED</span>;
      case 'UNDER_REVIEW': return <span className="badge bg-info text-dark">UNDER REVIEW</span>;
      case 'VERIFIED': return <span className="badge bg-success">VERIFIED</span>;
      case 'REJECTED': return <span className="badge bg-danger">REJECTED</span>;
      case 'CORRECTION_REQUIRED': return <span className="badge bg-warning text-dark">CORRECTION REQUIRED</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container py-5 min-vh-100">
      <Link to="/applications" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center">
        <ArrowLeft size={16} className="me-2" /> Back to My Applications
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
                  Status: <span className="text-primary">{app.status}</span>
                </div>
              </div>
            </div>

            <h5 className="fw-bold mb-3 border-bottom pb-2">Application Form Data</h5>
            <div className="bg-light p-4 rounded-3 border mb-4">
              {app.formData && Object.entries(app.formData).map(([key, value]) => (
                <div className="row mb-3 border-bottom pb-2" key={key}>
                  <div className="col-sm-4 text-muted fw-medium text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="col-sm-8 text-dark">{value || 'N/A'}</div>
                </div>
              ))}
            </div>
            
            {app.status === 'DRAFT' && (
              <div className="alert alert-info d-flex align-items-center gap-3">
                <Edit size={24} className="flex-shrink-0"/>
                <div>
                  <strong>Draft Application</strong><br/>
                  This application has not been submitted yet. To complete your request, please resume editing from the service details page (editing functionality via API pending UI integration).
                </div>
              </div>
            )}

            {app.remarks && (
              <div className="alert alert-warning shadow-sm">
                <h6 className="fw-bold text-warning mb-2"><AlertCircle size={16} className="me-1"/> Officer Remarks / Corrections</h6>
                <p className="mb-0 text-dark">{app.remarks}</p>
              </div>
            )}
          </div>

          {/* Document Management Section */}
          <div className="glass-card p-5 shadow-sm">
            <h5 className="fw-bold mb-1 border-bottom pb-3 d-flex align-items-center gap-2">
              <FileSignature size={20} className="text-primary"/> Document Management
            </h5>
            <p className="text-muted small mb-4">Upload the required documents for your application. (Max 5MB: PDF, JPG, PNG)</p>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Document Requirement</th>
                    <th>Status</th>
                    <th>File</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {service.requiredDocuments?.map((reqDoc, idx) => {
                    const uploadedDoc = documents.find(d => d.documentType === reqDoc);
                    const isUploading = uploadingDocType === reqDoc;
                    
                    return (
                      <tr key={idx}>
                        <td className="fw-medium">
                          {reqDoc} <span className="badge bg-danger bg-opacity-10 text-danger ms-1">Required</span>
                        </td>
                        <td>
                          {uploadedDoc ? getDocStatusBadge(uploadedDoc.status) : <span className="badge bg-secondary bg-opacity-10 text-secondary">PENDING</span>}
                        </td>
                        <td>
                          {uploadedDoc ? (
                            <div className="d-flex align-items-center gap-2 text-muted small">
                              <File size={14}/> 
                              <span className="text-truncate" style={{maxWidth: '150px'}} title={uploadedDoc.originalFileName}>
                                {uploadedDoc.originalFileName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted small">-</span>
                          )}
                        </td>
                        <td className="text-end">
                          {isUploading ? (
                            <div className="d-flex align-items-center justify-content-end gap-2">
                              <div className="progress" style={{width: '60px', height: '6px'}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" style={{width: `${uploadProgress}%`}}></div>
                              </div>
                              <span className="small text-muted">{uploadProgress}%</span>
                            </div>
                          ) : uploadedDoc ? (
                            <div className="d-flex gap-2 justify-content-end">
                              <button onClick={() => handleDownloadDoc(uploadedDoc.id, uploadedDoc.originalFileName)} className="btn btn-sm btn-light border" title="Download">
                                <Download size={14}/>
                              </button>
                              <button onClick={() => handleDeleteDoc(uploadedDoc.id)} className="btn btn-sm btn-outline-danger" title="Delete">
                                <Trash2 size={14}/>
                              </button>
                              {/* Replace Input hidden */}
                              <label className="btn btn-sm btn-outline-primary mb-0 cursor-pointer" title="Replace">
                                <UploadCloud size={14}/>
                                <input type="file" className="d-none" onChange={(e) => handleFileUpload(e, reqDoc)} accept=".pdf,.jpg,.jpeg,.png"/>
                              </label>
                            </div>
                          ) : (
                            <label className="btn btn-sm btn-primary mb-0 cursor-pointer rounded-pill px-3 shadow-sm">
                              <UploadCloud size={14} className="me-1"/> Upload
                              <input type="file" className="d-none" onChange={(e) => handleFileUpload(e, reqDoc)} accept=".pdf,.jpg,.jpeg,.png"/>
                            </label>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {(!service.requiredDocuments || service.requiredDocuments.length === 0) && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">No documents required for this service.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="col-lg-4">
          <div className="glass-card p-4 shadow-sm sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-4">Tracking Timeline</h5>
            
            <div className="timeline position-relative ps-3 ms-2 border-start border-2 border-light">
              {steps.map((step, index) => {
                const isCompleted = index <= activeStep;
                const isActive = index === activeStep;
                const colorClass = isCompleted ? 'text-primary' : 'text-muted opacity-50';
                
                return (
                  <div key={index} className={`mb-4 position-relative ${colorClass}`}>
                    <div className={`position-absolute rounded-circle shadow-sm ${isCompleted ? 'bg-primary' : 'bg-light border'}`} 
                         style={{ width: '16px', height: '16px', left: '-25px', top: '4px' }}>
                    </div>
                    <h6 className={`fw-bold mb-1 ${isActive ? 'text-primary' : ''}`}>{step}</h6>
                    {isActive && index === 3 && ['REJECTED', 'CORRECTION_REQUIRED'].includes(app.status) && (
                      <div className="small text-danger fw-bold">{app.status}</div>
                    )}
                    {isActive && index === 3 && app.status === 'APPROVED' && (
                      <div className="small text-success fw-bold">Approved</div>
                    )}
                  </div>
                );
              })}
            </div>

            <hr className="my-4"/>

            <div className="d-flex align-items-center gap-3 mb-3">
              <User size={18} className="text-muted"/>
              <div>
                <div className="small text-muted">Applicant</div>
                <div className="fw-medium">{app.citizenName || 'N/A'}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <Briefcase size={18} className="text-muted"/>
              <div>
                <div className="small text-muted">Assigned Officer</div>
                <div className="fw-medium">{app.assignedOfficer || 'Pending Assignment'}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <Clock size={18} className="text-muted"/>
              <div>
                <div className="small text-muted">Last Updated</div>
                <div className="fw-medium">{new Date(app.updatedAt).toLocaleString()}</div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
