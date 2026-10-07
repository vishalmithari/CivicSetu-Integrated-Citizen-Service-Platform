import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Search, MapPin, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackApplication = () => {
  const [appId, setAppId] = useState('');
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!appId.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/applications/${appId.trim()}`);
      setApplication(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Application not found. Please check your Application ID.');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch application.');
      }
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  const getTimelineSteps = (status) => {
    const allSteps = [
      { id: 'SUBMITTED', label: 'Application Submitted', desc: 'Received by the department' },
      { id: 'DOCUMENT_VERIFICATION', label: 'Document Verification', desc: 'Checking uploaded proofs' },
      { id: 'UNDER_REVIEW', label: 'Officer Review', desc: 'Processing your request' },
      { id: 'APPROVED', label: 'Department Approval', desc: 'Final checks completed' },
      { id: 'COMPLETED', label: 'Completed', desc: 'Service delivered successfully' }
    ];

    let currentIndex = 0;
    if (status === 'COMPLETED') currentIndex = 4;
    else if (status === 'APPROVED') currentIndex = 3;
    else if (status === 'UNDER_REVIEW') currentIndex = 2;
    else if (status === 'DOCUMENT_VERIFICATION' || status === 'CORRECTION_REQUIRED') currentIndex = 1;
    else if (status === 'SUBMITTED') currentIndex = 0;
    
    // Draft or Rejected logic
    if (status === 'DRAFT') return [];
    
    return allSteps.map((step, index) => {
      let state = 'pending';
      if (index < currentIndex) state = 'completed';
      if (index === currentIndex) {
        if (status === 'CORRECTION_REQUIRED' && index === 1) state = 'error';
        else if (status === 'REJECTED') state = 'error';
        else state = 'active';
      }
      return { ...step, state };
    });
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h2 className="fw-bold gradient-text">Track Application</h2>
            <p className="text-muted">Enter your Application ID to track its real-time progress.</p>
          </div>

          <form onSubmit={handleSearch} className="mb-5">
            <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden">
              <span className="input-group-text bg-white border-0 ps-4 pe-2"><Search size={20} className="text-muted"/></span>
              <input 
                type="text" 
                className="form-control border-0 bg-white shadow-none" 
                placeholder="e.g. 64b1c2..." 
                value={appId}
                onChange={e => setAppId(e.target.value)}
              />
              <button type="submit" className="btn btn-primary px-5 fw-bold" disabled={loading}>
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger shadow-sm border-0"><AlertCircle className="me-2"/>{error}</div>}

          {application && (
            <div className="glass-card overflow-hidden p-0 fade-in">
              <div className="bg-light bg-opacity-50 p-4 border-bottom d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold text-primary mb-1">{application.serviceName}</h4>
                  <p className="text-muted mb-0 d-flex align-items-center gap-1"><FileText size={14}/> ID: {application.id}</p>
                </div>
                <Link to={`/applications/${application.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                  View Details
                </Link>
              </div>

              <div className="p-4 p-md-5">
                {application.status === 'DRAFT' ? (
                  <div className="text-center py-4">
                    <AlertCircle size={40} className="text-warning mb-3"/>
                    <h5>Application is in Draft</h5>
                    <p className="text-muted">You have not submitted this application yet.</p>
                  </div>
                ) : application.status === 'REJECTED' ? (
                  <div className="text-center py-4">
                    <AlertCircle size={40} className="text-danger mb-3"/>
                    <h5>Application Rejected</h5>
                    <p className="text-muted">{application.remarks || 'Your application did not meet the requirements.'}</p>
                  </div>
                ) : (
                  <div className="timeline-container ps-3">
                    {getTimelineSteps(application.status).map((step, idx) => (
                      <div key={step.id} className="d-flex mb-4 position-relative">
                        {idx !== 4 && <div className={`position-absolute border-start ${step.state === 'completed' ? 'border-success' : 'border-light'} border-2`} style={{ left: '11px', top: '24px', bottom: '-24px', zIndex: 0 }}></div>}
                        
                        <div className="position-relative z-1 pe-3">
                          {step.state === 'completed' ? (
                            <CheckCircle size={24} className="text-success bg-white rounded-circle" />
                          ) : step.state === 'active' ? (
                            <Clock size={24} className="text-primary bg-white rounded-circle" />
                          ) : step.state === 'error' ? (
                            <AlertCircle size={24} className="text-danger bg-white rounded-circle" />
                          ) : (
                            <div className="bg-light border border-2 border-secondary rounded-circle" style={{ width: '24px', height: '24px' }}></div>
                          )}
                        </div>
                        
                        <div>
                          <h6 className={`fw-bold mb-1 ${step.state === 'active' ? 'text-primary' : step.state === 'completed' ? 'text-dark' : 'text-muted'}`}>
                            {step.label}
                          </h6>
                          <p className="small text-muted mb-0">{step.desc}</p>
                          {step.state === 'error' && application.remarks && (
                            <div className="alert alert-danger mt-2 py-2 px-3 small border-0">{application.remarks}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackApplication;
