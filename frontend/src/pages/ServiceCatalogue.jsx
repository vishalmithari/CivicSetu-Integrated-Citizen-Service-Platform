import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Search, FileText, Filter, AlertCircle } from 'lucide-react';

const ServiceCatalogue = () => {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [deptRes, servRes] = await Promise.all([
        api.get('/departments'),
        api.get('/services')
      ]);
      setDepartments(deptRes.data);
      setServices(servRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load catalogue. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const fetchServices = async (query = searchQuery, dept = selectedDept) => {
    try {
      setLoading(true);
      let url = '/services';
      if (query && query.trim()) {
        url = `/services/search?query=${encodeURIComponent(query)}`;
        if (dept) url += `&departmentId=${dept}`;
      } else if (dept) {
        url = `/services/department/${dept}`;
      }
      const res = await api.get(url);
      setServices(res.data);
    } catch (err) {
      setError('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices(searchQuery, selectedDept);
  };

  const filterByDept = (deptId) => {
    setSelectedDept(deptId);
    fetchServices(searchQuery, deptId);
  };


  return (
    <div className="catalogue-container py-5">
      <div className="container">
        
        <div className="text-center mb-5 pt-4">
          <h1 className="fw-bold gradient-text display-5">What do you need help with?</h1>
          <p className="text-muted lead">Search and apply for MahaSeva citizen services directly online.</p>
          
          <form onSubmit={handleSearch} className="search-box mx-auto mt-4 position-relative">
            <Search className="position-absolute text-muted" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-control form-control-lg rounded-pill ps-5 shadow-sm" 
              placeholder="e.g., Income Certificate, Driving License..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary rounded-pill position-absolute" style={{ right: '8px', top: '8px', bottom: '8px' }}>Search</button>
          </form>
          <div className="mt-3 text-muted small"><AlertCircle size={14} className="me-1"/> Note: This is a prototype system with demo data.</div>
        </div>

        <div className="row g-4">
          {/* Sidebar Filters */}
          <div className="col-md-3">
            <div className="glass-card p-4 sticky-top" style={{ top: '100px' }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <Filter size={20} className="text-primary" />
                <h5 className="m-0 fw-bold">Departments</h5>
              </div>
              <div className="list-group list-group-flush gap-2">
                <button 
                  className={`list-group-item list-group-item-action rounded-3 border-0 ${!selectedDept ? 'active shadow-sm' : 'bg-transparent text-muted'}`}
                  onClick={() => filterByDept('')}
                >
                  All Services
                </button>
                {departments.map(dept => (
                  <button 
                    key={dept.id} 
                    className={`list-group-item list-group-item-action rounded-3 border-0 ${selectedDept === dept.id ? 'active shadow-sm' : 'bg-transparent text-muted'}`}
                    onClick={() => filterByDept(dept.id)}
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service List */}
          <div className="col-md-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Loading services...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger shadow-sm border-0"><AlertCircle className="me-2"/>{error}</div>
            ) : services.length === 0 ? (
              <div className="text-center py-5 glass-card">
                <FileText size={48} className="text-muted mb-3 opacity-50" />
                <h4 className="text-muted">No services found</h4>
                <p className="text-muted small">Try adjusting your search or filters.</p>
                <button className="btn btn-outline-primary rounded-pill mt-2" onClick={() => { setSearchQuery(''); filterByDept(''); }}>Clear Search</button>
              </div>
            ) : (
              <div className="row g-4">
                {services.map(service => (
                  <div className="col-md-6" key={service.id}>
                    <div className="glass-card h-100 p-4 service-card position-relative">
                      <span className="badge bg-primary bg-opacity-10 text-primary mb-3">
                        {service.department?.name || 'General'}
                      </span>
                      <h5 className="fw-bold mb-2">{service.name}</h5>
                      <p className="text-muted small mb-4 text-truncate-2">{service.description}</p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold text-success">{service.fee > 0 ? `₹${service.fee}` : 'Free'}</span>
                        <Link to={`/services/${service.id}`} className="btn btn-sm btn-primary rounded-pill px-3">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCatalogue;
