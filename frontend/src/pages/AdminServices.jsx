import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Activity, Edit2 } from 'lucide-react';

const AdminServices = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get(`/services/department/${user.departmentId}`);
        setServices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.departmentId) {
      fetchServices();
    }
  }, [user]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/services/${id}/status`, { active: !currentStatus });
      setServices(services.map(s => s.id === id ? { ...s, active: !currentStatus } : s));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Department Services</h3>
      
      {services.length === 0 ? (
        <div className="alert alert-info border-0 shadow-sm">
          No services available for your department.
        </div>
      ) : (
        <div className="row g-4">
          {services.map(service => (
            <div className="col-md-6 col-lg-4" key={service.id}>
              <div className={`card border-0 shadow-sm h-100 ${!service.active ? 'opacity-75 bg-light' : ''}`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold mb-0 text-dark">{service.name}</h5>
                    <span className={`badge ${service.active ? 'bg-success' : 'bg-secondary'}`}>
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-muted small mb-4" style={{ minHeight: '40px' }}>
                    {service.description.substring(0, 100)}{service.description.length > 100 ? '...' : ''}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-3">
                    <div className="small">
                      <span className="text-muted d-block">Fee</span>
                      <span className="fw-bold">₹{service.fee}</span>
                    </div>
                    <div className="small text-end">
                      <span className="text-muted d-block">Time</span>
                      <span className="fw-bold">{service.processingTime}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleStatus(service.id, service.active)}
                    className={`btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2 ${service.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                  >
                    <Activity size={16} />
                    {service.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServices;
