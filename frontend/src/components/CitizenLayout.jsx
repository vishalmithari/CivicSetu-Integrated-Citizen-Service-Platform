import React, { useContext, useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { 
  LogOut, 
  Home, 
  List, 
  FileText, 
  Search, 
  Bell, 
  User, 
  Settings, 
  HelpCircle,
  Briefcase,
  Shield
} from 'lucide-react';

const CitizenLayout = () => {
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
      const interval = setInterval(fetchUnread, 15000); // 15 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav glass-panel d-flex flex-column">
        <div className="d-flex align-items-center mb-5">
          <div className="brand-logo me-2">M</div>
          <h4 className="m-0 fw-bold gradient-text">MahaSeva</h4>
        </div>
        
        <div className="nav-items flex-grow-1">
          <div className="text-muted small fw-bold mb-2 mt-2 px-3">MAIN</div>
          <NavLink to="/dashboard" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <Home size={20} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/services" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <List size={20} /> <span>Services</span>
          </NavLink>
          <NavLink to="/applications" end className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <FileText size={20} /> <span>My Applications</span>
          </NavLink>
          <NavLink to="/applications/track" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <Search size={20} /> <span>Track Application</span>
          </NavLink>
          <NavLink to="/notifications" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <Bell size={20} className="me-3" /> 
            <span className="flex-grow-1">Notifications</span>
            {unreadCount > 0 && <span className="badge bg-danger rounded-pill">{unreadCount}</span>}
          </NavLink>

          <div className="text-muted small fw-bold mb-2 mt-4 px-3">ACCOUNT</div>
          <NavLink to="/profile" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <User size={20} /> <span>Profile</span>
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <Settings size={20} /> <span>Settings</span>
          </NavLink>

          <div className="text-muted small fw-bold mb-2 mt-4 px-3">SUPPORT</div>
          <NavLink to="/help" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 ${isActive ? 'active bg-primary text-white' : 'text-dark hover-bg-light'}`}>
            <HelpCircle size={20} /> <span>Help & Support</span>
          </NavLink>

          {(user?.roles?.includes('ROLE_OFFICER') || user?.roles?.includes('ROLE_DEPT_ADMIN') || user?.roles?.includes('ROLE_SUPER_ADMIN')) && (
            <div className="text-muted small fw-bold mb-2 mt-4 px-3">PORTALS</div>
          )}
          {user?.roles?.includes('ROLE_OFFICER') && (
            <Link to="/officer/dashboard" className="nav-item text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 text-dark hover-bg-light">
              <Briefcase size={20} /> <span>Officer Portal</span>
            </Link>
          )}
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

export default CitizenLayout;
