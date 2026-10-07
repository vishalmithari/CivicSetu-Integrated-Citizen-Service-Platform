import React, { useContext, useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileText, Users, Settings, Bell, User, LogOut, Layers, BarChart2 } from 'lucide-react';

const AdminLayout = () => {
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
      {/* Sidebar */}
      <nav className="dashboard-nav bg-white border-end d-flex flex-column" style={{ zIndex: 1030 }}>
        <div className="d-flex align-items-center mb-5">
          <div className="bg-primary text-white rounded p-1 me-2 d-flex align-items-center justify-content-center">
            <Layers size={20} />
          </div>
          <h4 className="m-0 fw-bold text-primary">Admin Portal</h4>
        </div>
        
        <div className="nav-items flex-grow-1 overflow-auto">
          <div className="text-muted small fw-bold mb-2 px-3 text-uppercase">Menu</div>
          <NavLink to="/admin/dashboard" className={({isActive}) => `nav-item text-decoration-none px-3 py-2 ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/reports" className={({isActive}) => `nav-item text-decoration-none px-3 py-2 ${isActive ? 'active' : ''}`}>
            <BarChart2 size={20} /> <span>Reports</span>
          </NavLink>
          <NavLink to="/admin/applications" className={({isActive}) => `nav-item text-decoration-none px-3 py-2 ${isActive ? 'active' : ''}`}>
            <FileText size={20} /> <span>Applications</span>
          </NavLink>
          <NavLink to="/admin/officers" className={({isActive}) => `nav-item text-decoration-none px-3 py-2 ${isActive ? 'active' : ''}`}>
            <Users size={20} /> <span>Officers</span>
          </NavLink>
          <NavLink to="/admin/services" className={({isActive}) => `nav-item text-decoration-none px-3 py-2 ${isActive ? 'active' : ''}`}>
            <Settings size={20} /> <span>Services</span>
          </NavLink>
          <NavLink to="/admin/notifications" className={({isActive}) => `nav-item text-decoration-none d-flex align-items-center px-3 py-2 ${isActive ? 'active' : ''}`}>
            <Bell size={20} className="me-3" /> 
            <span className="flex-grow-1">Notifications</span>
            {unreadCount > 0 && <span className="badge bg-danger rounded-pill">{unreadCount}</span>}
          </NavLink>
        </div>

        <div className="mt-4 border-top pt-3 pb-2">
          <NavLink to="/admin/profile" className={({isActive}) => `nav-item text-decoration-none px-3 py-2 mb-2 ${isActive ? 'active' : ''}`}>
            <User size={20} /> <span>Profile</span>
          </NavLink>
          <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-content p-0 d-flex flex-column">
        <header className="bg-white border-bottom p-4 d-flex justify-content-between align-items-center sticky-top shadow-sm" style={{ zIndex: 1020 }}>
          <h4 className="m-0 fw-bold text-dark">Department Administration</h4>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2 shadow-sm border border-light">
              <User size={16} className="text-primary me-2"/> 
              <span className="fw-medium text-dark small">{user?.username} <span className="text-muted ms-1">({user?.roles?.includes('ROLE_SUPER_ADMIN') ? 'Super Admin' : 'Dept Admin'})</span></span>
            </div>
          </div>
        </header>
        <div className="p-4 flex-grow-1 overflow-auto bg-light">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
