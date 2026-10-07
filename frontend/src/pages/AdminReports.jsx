import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Download, Calendar, Filter, FileText } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      let params = {};
      if (dateRange === 'custom' && customStart && customEnd) {
        params = { startDate: customStart, endDate: customEnd };
      } else if (dateRange !== 'all' && dateRange !== 'custom') {
        const end = new Date();
        const start = new Date();
        if (dateRange === '7days') start.setDate(start.getDate() - 7);
        if (dateRange === '30days') start.setDate(start.getDate() - 30);
        if (dateRange === 'month') start.setDate(1);
        params = { 
          startDate: start.toISOString().split('T')[0], 
          endDate: end.toISOString().split('T')[0] 
        };
      }
      
      const res = await api.get('/admin/reports', { params });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange !== 'custom') {
      fetchReports();
    }
  }, [dateRange]);

  const handleCustomDateApply = () => {
    if (customStart && customEnd) fetchReports();
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/admin/applications');
      const apps = res.data;
      if (!apps || apps.length === 0) return alert('No data to export.');
      
      const headers = ['ID', 'Service', 'Department', 'Citizen', 'Status', 'Date', 'Assigned Officer'];
      const csvRows = [headers.join(',')];
      
      apps.forEach(app => {
        csvRows.push([
          app.applicationNumber,
          `"${app.serviceName}"`,
          `"${app.departmentName}"`,
          `"${app.citizenName}"`,
          app.status,
          new Date(app.submittedAt || app.createdAt).toLocaleDateString(),
          `"${app.assignedOfficer || 'Unassigned'}"`
        ].join(','));
      });
      
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `mahaseva_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Failed to export CSV');
    }
  };

  if (loading && !stats) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!stats) return <div className="container py-5"><div className="alert alert-danger">Failed to load reports.</div></div>;

  const statusData = {
    labels: Object.keys(stats.applicationsByStatus || {}),
    datasets: [{
      label: 'Applications',
      data: Object.values(stats.applicationsByStatus || {}),
      backgroundColor: ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#6b7280', '#3b82f6', '#8b5cf6']
    }]
  };

  const deptData = {
    labels: Object.keys(stats.applicationsByDepartment || {}),
    datasets: [{
      label: 'Applications',
      data: Object.values(stats.applicationsByDepartment || {}),
      backgroundColor: '#3b82f6'
    }]
  };

  const officerData = {
    labels: Object.keys(stats.officerWorkload || {}),
    datasets: [{
      label: 'Processed Applications',
      data: Object.values(stats.officerWorkload || {}),
      backgroundColor: '#10b981'
    }]
  };

  const serviceData = {
    labels: Object.keys(stats.applicationsByService || {}),
    datasets: [{
      data: Object.values(stats.applicationsByService || {}),
      backgroundColor: ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']
    }]
  };

  return (
    <div className="container py-4 min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-dark">Analytics & Reports</h2>
          <p className="text-muted mb-0">System performance and application statistics.</p>
        </div>
        <button onClick={handleExportCSV} className="btn btn-primary d-flex align-items-center gap-2 rounded-pill shadow-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-3 shadow-sm mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small text-muted fw-bold">Date Range</label>
            <div className="position-relative">
              <Calendar className="position-absolute text-muted" style={{ top: '10px', left: '12px' }} size={16}/>
              <select 
                className="form-select ps-5 rounded-3 bg-light border-0"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          
          {dateRange === 'custom' && (
            <>
              <div className="col-md-3">
                <label className="form-label small text-muted fw-bold">Start Date</label>
                <input type="date" className="form-control bg-light border-0 rounded-3" value={customStart} onChange={e => setCustomStart(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted fw-bold">End Date</label>
                <input type="date" className="form-control bg-light border-0 rounded-3" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
              </div>
              <div className="col-md-2">
                <button onClick={handleCustomDateApply} className="btn btn-primary w-100 rounded-3">Apply</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="glass-card p-4 shadow-sm h-100 border-start border-4 border-primary">
            <div className="text-muted small fw-bold text-uppercase mb-2">Total Applications</div>
            <h3 className="fw-bold mb-0 text-primary">{stats.totalApplications}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 shadow-sm h-100 border-start border-4 border-warning">
            <div className="text-muted small fw-bold text-uppercase mb-2">Pending / Correction</div>
            <h3 className="fw-bold mb-0 text-warning">{stats.pendingReview + stats.correctionRequired}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 shadow-sm h-100 border-start border-4 border-info">
            <div className="text-muted small fw-bold text-uppercase mb-2">In Process</div>
            <h3 className="fw-bold mb-0 text-info">{stats.documentVerification}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="glass-card p-4 shadow-sm h-100 border-start border-4 border-success">
            <div className="text-muted small fw-bold text-uppercase mb-2">Completed / Approved</div>
            <h3 className="fw-bold mb-0 text-success">{stats.completed + stats.approved}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mb-5">
        <div className="col-md-8">
          <div className="glass-card p-4 shadow-sm h-100">
            <h5 className="fw-bold mb-4">Applications by Department</h5>
            <div style={{ height: '300px' }}>
              <Bar data={deptData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="glass-card p-4 shadow-sm h-100">
            <h5 className="fw-bold mb-4">Applications by Service</h5>
            <div style={{ height: '300px' }}>
              <Doughnut data={serviceData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card p-4 shadow-sm h-100">
            <h5 className="fw-bold mb-4">Status Distribution</h5>
            <div style={{ height: '300px' }}>
              <Bar data={statusData} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card p-4 shadow-sm h-100">
            <h5 className="fw-bold mb-4">Officer Workload</h5>
            <div style={{ height: '300px' }}>
              <Bar data={officerData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
