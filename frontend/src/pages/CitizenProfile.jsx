import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, Edit2, Key } from 'lucide-react';

const CitizenProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ firstName: user.firstName || '', lastName: user.lastName || '' });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/me', formData);
      setUser(res.data);
      setMessage('Profile updated successfully.');
      setError('');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
      setMessage('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }
    try {
      await api.put('/users/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPwdMessage('Password updated successfully.');
      setPwdError('');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdError(err.response?.data?.error || 'Failed to update password.');
      setPwdMessage('');
    }
  };

  if (!user) return null;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 gradient-text">My Profile</h2>
      
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><User className="text-primary"/> Personal Information</h5>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1">
                  <Edit2 size={14}/> Edit
                </button>
              )}
            </div>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {editing ? (
              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary rounded-pill px-4">Save Changes</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn btn-light border rounded-pill px-4">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase">Full Name</label>
                  <p className="fs-5 mb-0">{user.firstName} {user.lastName}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase">Username</label>
                  <p className="fs-5 mb-0">@{user.username}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase">Email Address</label>
                  <p className="fs-5 mb-0 d-flex align-items-center gap-2"><Mail size={16} className="text-muted"/> {user.email}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small fw-bold text-uppercase">Member Since</label>
                  <p className="fs-5 mb-0 d-flex align-items-center gap-2"><Calendar size={16} className="text-muted"/> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-12">
                  <label className="text-muted small fw-bold text-uppercase">Account Roles</label>
                  <div className="d-flex gap-2 mt-1">
                    {user.roles.map(r => (
                      <span key={r} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill">
                        <Shield size={14} className="me-1"/> {r.replace('ROLE_', '').replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Key className="text-primary"/> Change Password</h5>
            
            {pwdMessage && <div className="alert alert-success">{pwdMessage}</div>}
            {pwdError && <div className="alert alert-danger">{pwdError}</div>}

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength="6" />
              </div>
              <div className="mb-4">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-outline-primary rounded-pill w-100">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenProfile;
