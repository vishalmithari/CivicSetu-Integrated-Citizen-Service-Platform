import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { User, FileText, CheckCircle, Clock, Bell, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, completed: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const appsRes = await api.get('/applications/my');
        const apps = appsRes.data;
        
        const total = apps.length;
        const pending = apps.filter(a => ['SUBMITTED', 'UNDER_REVIEW', 'DOCUMENT_VERIFICATION'].includes(a.status)).length;
        const approved = apps.filter(a => a.status === 'APPROVED').length;
        const completed = apps.filter(a => a.status === 'COMPLETED').length;
        
        setStats({ total, pending, approved, completed });
        
        // Get 3 most recent
        setRecentApps(apps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-2">
      <header className="d-flex justify-content-between align-items-center mb-5 fade-in">
        <div>
          <h2 className="fw-bold m-0 gradient-text">Welcome back, {user?.firstName || user?.username}!</h2>
          <p className="text-muted">Here is what's happening with your applications today.</p>
        </div>
        <div className="user-profile-badge bg-white shadow-sm px-3 py-2 rounded-pill d-flex align-items-center gap-2 border">
          <User size={18} className="text-primary" />
          <span className="fw-medium text-dark">@{user?.username}</span>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="row g-4 mb-5 fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="col-md-3">
          <div className="glass-card p-4 border-start border-primary border-4 text-center h-100">
            <FileText size={24} className="text-primary mb-2" />
            <h3 className="fw-bold mb-0">{stats.total}</h3>
            <p className="text-muted small text-uppercase fw-bold mb-0">Total Apps</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 border-start border-info border-4 text-center h-100">
            <Clock size={24} className="text-info mb-2" />
            <h3 className="fw-bold mb-0">{stats.pending}</h3>
            <p className="text-muted small text-uppercase fw-bold mb-0">Pending</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 border-start border-success border-4 text-center h-100">
            <CheckCircle size={24} className="text-success mb-2" />
            <h3 className="fw-bold mb-0">{stats.approved}</h3>
            <p className="text-muted small text-uppercase fw-bold mb-0">Approved</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 border-start border-dark border-4 text-center h-100">
            <CheckCircle size={24} className="text-dark mb-2" />
            <h3 className="fw-bold mb-0">{stats.completed}</h3>
            <p className="text-muted small text-uppercase fw-bold mb-0">Completed</p>
          </div>
        </div>
      </div>

      <div className="row g-4 fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0">Recent Applications</h5>
            <Link to="/applications" className="text-decoration-none small fw-bold">View All <ArrowRight size={14}/></Link>
          </div>
          
          <div className="glass-card p-0 overflow-hidden">
            {recentApps.length === 0 ? (
              <div className="p-5 text-center">
                <FileText size={40} className="text-muted opacity-25 mb-2 mx-auto"/>
                <h6 className="text-muted mb-0">No applications yet.</h6>
              </div>
            ) : (
              <ul className="list-group list-group-flush">
                {recentApps.map(app => (
                  <li key={app.id} className="list-group-item p-4 bg-transparent d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold text-primary mb-1">{app.serviceName}</h6>
                      <p className="text-muted small mb-0">ID: {app.applicationNumber} • {new Date(app.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="badge bg-light text-dark border">{app.status.replace('_', ' ')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <h5 className="fw-bold mb-3">Quick Actions</h5>
          <div className="d-flex flex-column gap-3">
            <Link to="/services" className="glass-card p-3 text-decoration-none d-flex align-items-center gap-3 transition-hover">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle"><FileText size={20}/></div>
              <div className="text-dark fw-bold">Browse Services</div>
            </Link>
            <Link to="/applications/track" className="glass-card p-3 text-decoration-none d-flex align-items-center gap-3 transition-hover">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle"><Clock size={20}/></div>
              <div className="text-dark fw-bold">Track Application</div>
            </Link>
            <Link to="/notifications" className="glass-card p-3 text-decoration-none d-flex align-items-center gap-3 transition-hover">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle"><Bell size={20}/></div>
              <div className="text-dark fw-bold">View Notifications</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
