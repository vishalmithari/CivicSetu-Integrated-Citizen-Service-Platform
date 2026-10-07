import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Globe, Shield, LogOut, ChevronRight } from 'lucide-react';

const CitizenSettings = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [prefs, setPrefs] = useState({ appUpdates: true, serviceUpdates: false, announcements: true });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 gradient-text">Settings</h2>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="glass-card p-0 overflow-hidden mb-4">
            <div className="p-4 border-bottom bg-light bg-opacity-50">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><Bell className="text-primary"/> Notification Preferences</h5>
            </div>
            <div className="p-4">
              <div className="form-check form-switch mb-3 d-flex justify-content-between align-items-center p-0">
                <label className="form-check-label mb-0">Application status updates</label>
                <input className="form-check-input m-0" type="checkbox" role="switch" checked={prefs.appUpdates} onChange={() => setPrefs({...prefs, appUpdates: !prefs.appUpdates})} />
              </div>
              <div className="form-check form-switch mb-3 d-flex justify-content-between align-items-center p-0">
                <label className="form-check-label mb-0">New service availability</label>
                <input className="form-check-input m-0" type="checkbox" role="switch" checked={prefs.serviceUpdates} onChange={() => setPrefs({...prefs, serviceUpdates: !prefs.serviceUpdates})} />
              </div>
              <div className="form-check form-switch d-flex justify-content-between align-items-center p-0">
                <label className="form-check-label mb-0">General announcements</label>
                <input className="form-check-input m-0" type="checkbox" role="switch" checked={prefs.announcements} onChange={() => setPrefs({...prefs, announcements: !prefs.announcements})} />
              </div>
            </div>
          </div>

          <div className="glass-card p-0 overflow-hidden">
            <div className="p-4 border-bottom bg-light bg-opacity-50">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><Globe className="text-primary"/> Language Settings</h5>
            </div>
            <div className="p-4">
              <select className="form-select w-100" value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="en">English</option>
                <option value="mr">Marathi (मराठी)</option>
              </select>
              <small className="text-muted mt-2 d-block">Language changes will be applied on the next reload.</small>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="glass-card p-0 overflow-hidden mb-4">
            <div className="p-4 border-bottom bg-light bg-opacity-50">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><Shield className="text-primary"/> Privacy & Security</h5>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="text-muted small fw-bold text-uppercase">Current Session</label>
                <p className="mb-0">Logged in as <strong>{user?.username}</strong></p>
                <p className="small text-muted">Started: {new Date().toLocaleDateString()} (Active now)</p>
              </div>
              
              <Link to="/profile" className="btn btn-outline-primary w-100 rounded-pill d-flex align-items-center justify-content-between mb-2">
                <span>Update Password</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="glass-card p-4 text-center">
            <SettingsIcon size={40} className="text-muted mb-3 opacity-50" />
            <h5 className="fw-bold">Account Options</h5>
            <p className="text-muted small mb-4">You can sign out of your MahaSeva account safely here.</p>
            <button onClick={handleLogout} className="btn btn-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2">
              <LogOut size={16} /> Logout Securely
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenSettings;
