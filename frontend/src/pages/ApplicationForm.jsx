import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Save, Send, AlertCircle, FileText } from 'lucide-react';

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [service, setService] = useState(null);
  
  // Generic form data
  const [formData, setFormData] = useState({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    phoneNumber: '',
    address: '',
    additionalDetails: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        setError('Service not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (isSubmit) => {
    // Basic client-side validation for submission
    if (isSubmit) {
      if (!formData.fullName || !formData.phoneNumber || !formData.address) {
        setError("Please fill in all required fields before submitting.");
        return;
      }
    }
    
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        serviceId: id,
        formData: formData,
        documents: [],
        submit: isSubmit
      };
      
      const res = await api.post('/applications', payload);
      
      if (isSubmit) {
        setSuccess({
          appNumber: res.data.applicationNumber,
          serviceName: res.data.serviceName,
          date: new Date().toLocaleDateString()
        });
      } else {
        alert("Draft saved successfully!");
        navigate('/applications');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (error && !service) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;

  if (success) {
    return (
      <div className="container py-5">
        <div className="glass-card p-5 text-center max-w-2xl mx-auto shadow-lg">
          <div className="rounded-circle bg-success bg-opacity-10 text-success mx-auto d-flex align-items-center justify-content-center mb-4" style={{width: '80px', height: '80px'}}>
            <FileText size={40} />
          </div>
          <h2 className="fw-bold text-success mb-3">Application Submitted Successfully</h2>
          <p className="text-muted lead mb-4">Your application has been received and is under review.</p>
          
          <div className="bg-light p-4 rounded-3 text-start mb-5 border">
            <div className="row mb-3">
              <div className="col-5 text-muted">Application ID:</div>
              <div className="col-7 fw-bold">{success.appNumber}</div>
            </div>
            <div className="row mb-3">
              <div className="col-5 text-muted">Service:</div>
              <div className="col-7 fw-medium">{success.serviceName}</div>
            </div>
            <div className="row mb-3">
              <div className="col-5 text-muted">Status:</div>
              <div className="col-7"><span className="badge bg-primary">SUBMITTED</span></div>
            </div>
            <div className="row">
              <div className="col-5 text-muted">Submitted Date:</div>
              <div className="col-7">{success.date}</div>
            </div>
          </div>
          
          <div className="d-flex justify-content-center gap-3">
            <Link to="/applications" className="btn btn-primary rounded-pill px-4">View My Applications</Link>
            <Link to="/services" className="btn btn-outline-primary rounded-pill px-4">Browse More Services</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link to={`/services/${id}`} className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center">
        <ArrowLeft size={16} className="me-2" /> Back to Service Details
      </Link>
      
      <div className="glass-card p-5 shadow-sm max-w-2xl mx-auto">
        <div className="mb-4 pb-3 border-bottom">
          <span className="badge bg-primary bg-opacity-10 text-primary mb-2">
            {service.department?.name}
          </span>
          <h3 className="fw-bold m-0">Apply for {service.name}</h3>
        </div>

        {error && <div className="alert alert-danger shadow-sm"><AlertCircle className="me-2" size={18}/>{error}</div>}
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="form-label fw-bold">Full Name <span className="text-danger">*</span></label>
            <input 
              type="text" 
              name="fullName"
              className="form-control bg-light" 
              value={formData.fullName} 
              onChange={handleChange}
              placeholder="As per Aadhar / Official ID"
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-bold">Phone Number <span className="text-danger">*</span></label>
            <input 
              type="tel" 
              name="phoneNumber"
              className="form-control bg-light" 
              value={formData.phoneNumber} 
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-bold">Current Address <span className="text-danger">*</span></label>
            <textarea 
              name="address"
              className="form-control bg-light" 
              rows="3" 
              value={formData.address} 
              onChange={handleChange}
              placeholder="Enter your complete residential address"
              required 
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-bold">Additional Remarks / Details</label>
            <textarea 
              name="additionalDetails"
              className="form-control bg-light" 
              rows="2" 
              value={formData.additionalDetails} 
              onChange={handleChange}
              placeholder="Any specific information requested by the service..."
            ></textarea>
          </div>

          <div className="alert alert-warning bg-warning bg-opacity-10 border-warning border-opacity-50 small mb-4">
            <strong>Document Upload Phase:</strong> Document upload feature is scheduled for the next phase. Currently, applications are submitted without attachments.
          </div>

          <div className="d-flex justify-content-end gap-3 pt-3 border-top">
            <button 
              type="button" 
              className="btn btn-light border px-4 d-flex align-items-center gap-2 rounded-pill"
              onClick={() => handleSave(false)}
              disabled={submitting}
            >
              <Save size={18} /> Save Draft
            </button>
            <button 
              type="button" 
              className="btn btn-primary px-5 fw-bold d-flex align-items-center gap-2 rounded-pill shadow-sm"
              onClick={() => handleSave(true)}
              disabled={submitting}
            >
              <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
