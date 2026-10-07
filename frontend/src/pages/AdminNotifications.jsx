import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Bell, Check, CheckCircle } from 'lucide-react';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllAsRead} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2">
            <CheckCircle size={16} /> Mark all as read
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="alert alert-info border-0 shadow-sm">
          You have no notifications.
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <ul className="list-group list-group-flush">
            {notifications.map(n => (
              <li key={n.id} className={`list-group-item p-4 ${n.read ? 'bg-white' : 'bg-light'}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex gap-3 align-items-start">
                    <div className={`mt-1 rounded-circle p-2 ${n.read ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-primary bg-opacity-10 text-primary'}`}>
                      <Bell size={20} />
                    </div>
                    <div>
                      <h6 className={`mb-1 ${n.read ? 'text-muted' : 'fw-bold text-dark'}`}>
                        {n.title || 'System Notification'}
                      </h6>
                      <p className={`mb-1 ${n.read ? 'text-muted' : 'text-dark'}`}>{n.message}</p>
                      <div className="d-flex gap-3 text-muted small mt-2">
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                        {n.applicationId && (
                          <span className="badge bg-secondary">App ID: {n.applicationId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="btn btn-sm btn-light text-primary border" title="Mark as read">
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
