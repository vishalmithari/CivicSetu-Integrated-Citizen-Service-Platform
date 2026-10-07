import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ServiceCatalogue from './pages/ServiceCatalogue';
import ServiceDetails from './pages/ServiceDetails';
import ApplicationForm from './pages/ApplicationForm';
import MyApplications from './pages/MyApplications';
import ApplicationDetails from './pages/ApplicationDetails';
import CitizenLayout from './components/CitizenLayout';
import CitizenProfile from './pages/CitizenProfile';
import CitizenSettings from './pages/CitizenSettings';
import TrackApplication from './pages/TrackApplication';
import CitizenNotifications from './pages/CitizenNotifications';
import HelpSupport from './pages/HelpSupport';
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerApplications from './pages/OfficerApplications';
import OfficerApplicationDetails from './pages/OfficerApplicationDetails';
import OfficerLayout from './components/OfficerLayout';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminReports from './pages/AdminReports';
import AdminApplications from './pages/AdminApplications';
import AdminApplicationDetails from './pages/AdminApplicationDetails';
import AdminOfficers from './pages/AdminOfficers';
import AdminServices from './pages/AdminServices';
import AdminNotifications from './pages/AdminNotifications';
import AdminProfile from './pages/AdminProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<CitizenLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/services" element={<ServiceCatalogue />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/applications/track" element={<TrackApplication />} />
              <Route path="/applications/:id" element={<ApplicationDetails />} />
              <Route path="/profile" element={<CitizenProfile />} />
              <Route path="/settings" element={<CitizenSettings />} />
              <Route path="/notifications" element={<CitizenNotifications />} />
              <Route path="/help" element={<HelpSupport />} />
            </Route>
            <Route path="/services/:id/apply" element={<ApplicationForm />} />
          </Route>
            
          <Route element={<ProtectedRoute allowedRoles={['ROLE_OFFICER']} />}>
            <Route element={<OfficerLayout />}>
              <Route path="/officer/dashboard" element={<OfficerDashboard />} />
              <Route path="/officer/applications" element={<OfficerApplications />} />
              <Route path="/officer/applications/:id" element={<OfficerApplicationDetails />} />
              <Route path="/officer/notifications" element={<CitizenNotifications />} />
              <Route path="/officer/profile" element={<CitizenProfile />} />
              <Route path="/officer/settings" element={<CitizenSettings />} />
              <Route path="/officer/help" element={<HelpSupport />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ROLE_DEPT_ADMIN', 'ROLE_SUPER_ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/applications/:id" element={<AdminApplicationDetails />} />
              <Route path="/admin/officers" element={<AdminOfficers />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
