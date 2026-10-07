import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Building } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div>
      <h3 className="fw-bold mb-4">My Profile</h3>
      
      <div className="row g-4">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fs-2 fw-bold" style={{ width: '80px', height: '80px' }}>
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div>
                  <h4 className="fw-bold mb-1">{user.firstName} {user.lastName}</h4>
                  <p className="text-muted mb-0">@{user.username}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-bold text-uppercase mb-1">Email Address</label>
                <div className="d-flex align-items-center gap-2 fs-5 fw-medium">
                  <Mail size={20} className="text-primary"/> {user.email}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-muted small fw-bold text-uppercase mb-1">System Role</label>
                <div className="d-flex align-items-center gap-2 fs-5 fw-medium">
                  <Shield size={20} className="text-primary"/> 
                  {user.roles?.includes('ROLE_SUPER_ADMIN') ? 'Super Administrator' : 'Department Administrator'}
                </div>
              </div>

              <div className="mb-2">
                <label className="text-muted small fw-bold text-uppercase mb-1">Assigned Department</label>
                <div className="d-flex align-items-center gap-2 fs-5 fw-medium">
                  <Building size={20} className="text-primary"/> 
                  {user.departmentId ? `Department ID: ${user.departmentId}` : 'All Departments (System Wide)'}
                </div>
              </div>
              
              <div className="alert alert-warning mt-4 mb-0 border-0">
                <small className="fw-bold">Note:</small> <small>Role and Department assignments can only be modified by a Super Administrator. Profile editing is currently restricted for administrative accounts.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
