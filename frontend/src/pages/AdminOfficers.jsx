import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { User, Mail, Hash, Shield } from 'lucide-react';

const AdminOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await api.get('/admin/officers');
        setOfficers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Department Officers</h3>
      
      <div className="row g-4">
        {officers.map(officer => (
          <div className="col-md-4" key={officer.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4 text-center">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <Shield size={30} />
                </div>
                <h5 className="fw-bold mb-1">{officer.firstName} {officer.lastName}</h5>
                <p className="text-muted small mb-3">@{officer.username}</p>
                
                <div className="d-flex justify-content-center gap-2 mb-3">
                  <span className="badge bg-light text-dark border"><Mail size={12} className="me-1"/> {officer.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {officers.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info">No officers found in this department.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOfficers;
