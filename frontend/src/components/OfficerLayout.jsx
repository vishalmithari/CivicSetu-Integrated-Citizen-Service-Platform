import React, { useContext, useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { 
  LogOut, 
  Home, 
  List, 
  FileText, 
  Bell, 
  User, 
  Settings, 
  HelpCircle,
  Briefcase,
  Shield,
  CheckSquare,
  Files
} from 'lucide-react';

const OfficerLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        setUnreadCount(res.data.filter(n => !n.read).length);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav glass-panel d-flex flex-column" style={{ zIndex: 1030 }}>
        <div className="d-flex align-items-center mb-5">
          <div className="brand-logo me-2 bg-primary">M</div>
          <h4 className="m-0 fw-bold text-primary">MahaSeva Officer</h4>
        </div>
        
        <div className="nav-items flex-grow-1">
          <div className="text-muted small fw-bold mb-2 mt-2 px-3">MAIN</div>
          <NavLink to="/officer/dashboard" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <Home size={20} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/officer/applications" end className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <FileText size={20} /> <span>Applications</span>
          </NavLink>
          <NavLink to="/officer/applications?status=UNDER_REVIEW" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <CheckSquare size={20} /> <span>Pending Verification</span>
          </NavLink>
          <NavLink to="/officer/applications?status=DOCUMENT_VERIFICATION" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <Files size={20} /> <span>Documents</span>
          </NavLink>
          <NavLink to="/officer/notifications" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <Bell size={20} className="me-3" /> 
            <span className="flex-grow-1">Notifications</span>
            {unreadCount > 0 && <span className="badge bg-danger rounded-pill">{unreadCount}</span>}
          </NavLink>

          <div className="text-muted small fw-bold mb-2 mt-4 px-3">ACCOUNT</div>
          <NavLink to="/officer/profile" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <User size={20} /> <span>Profile</span>
          </NavLink>
          <NavLink to="/officer/settings" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <Settings size={20} /> <span>Settings</span>
          </NavLink>

          <div className="text-muted small fw-bold mb-2 mt-4 px-3">SUPPORT</div>
          <NavLink to="/officer/help" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <HelpCircle size={20} /> <span>Help & Support</span>
          </NavLink>

          <div className="text-muted small fw-bold mb-2 mt-4 px-3">PORTALS</div>
          <Link to="/dashboard" className="nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 text-dark hover-bg-light">
            <User size={20} /> <span>Citizen Portal</span>
          </Link>
          {(user?.roles?.includes('ROLE_DEPT_ADMIN') || user?.roles?.includes('ROLE_SUPER_ADMIN')) && (
            <Link to="/admin/dashboard" className="nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 text-dark hover-bg-light">
              <Shield size={20} /> <span>Admin Panel</span>
            </Link>
          )}
        </div>
        
        <div className="mt-4 border-top pt-3 pb-2">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>
      
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default OfficerLayout;
