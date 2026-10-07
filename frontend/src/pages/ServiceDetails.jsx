import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Clock, FileCheck, IndianRupee, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        setError('Failed to load service details. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleApply = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/services/${id}/apply`);
    }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!service) return <div className="container py-5 text-center">Service not found.</div>;

  return (
    <div className="service-details-container py-5 bg-light min-vh-100">
      <div className="container">
        <Link to="/services" className="text-decoration-none text-muted mb-4 d-inline-flex align-items-center">
          <ArrowLeft size={16} className="me-2" /> Back to Catalogue
        </Link>
        
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card p-5 mb-4">
              <span className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill">
                {service.department?.name}
              </span>
              <h2 className="fw-bold mb-3">{service.name}</h2>
              <p className="text-muted lead mb-0">{service.description}</p>
            </div>

            <div className="glass-card p-5">
              <h4 className="fw-bold mb-4 border-bottom pb-3">Service Details</h4>
              
              <div className="mb-4">
                <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mb-3">
                  <ShieldAlert size={18} /> Eligibility
                </h6>
                <p className="text-muted ps-4 border-start border-2 border-primary">{service.eligibility}</p>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mb-3">
                  <FileCheck size={18} /> Required Documents
                </h6>
                <ul className="list-unstyled ps-4">
                  {service.requiredDocuments?.map((doc, idx) => (
                    <li key={idx} className="mb-2 text-muted d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-success bg-opacity-25 p-1"><div className="bg-success rounded-circle" style={{width:'6px', height:'6px'}}></div></div> {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mb-3">
                  <BookOpen size={18} /> Application Process
                </h6>
                <p className="text-muted ps-4 border-start border-2 border-primary">{service.applicationProcess}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card p-4 position-sticky" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-4">Application Summary</h5>
              
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div className="d-flex align-items-center text-muted">
                  <Clock size={18} className="me-2" /> Processing Time
                </div>
                <div className="fw-bold text-dark">{service.processingTime}</div>
              </div>
              
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center text-muted">
                  <IndianRupee size={18} className="me-2" /> Application Fee
                </div>
                <div className="fw-bold text-success fs-5">{service.fee > 0 ? `₹${service.fee}` : 'Free'}</div>
              </div>

              <button 
                onClick={handleApply} 
                className="btn btn-primary w-100 py-3 rounded-pill shadow-lg fw-bold d-flex justify-content-center align-items-center gap-2"
              >
                {user ? "Start Application" : "Login to Apply"}
              </button>
              
              {!user && (
                <div className="text-center mt-3 small text-muted">
                  You must be logged in to apply.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
