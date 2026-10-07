import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Bell, Check, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CitizenNotifications = () => {
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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 gradient-text">Notifications</h2>
          <p className="text-muted mb-0">Updates about your applications and services.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllAsRead} className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-2 px-3">
            <CheckCircle size={16} /> Mark all as read
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="glass-card p-5 text-center">
          <Bell size={48} className="text-muted mb-3 opacity-25 mx-auto" />
          <h4 className="text-muted">All caught up!</h4>
          <p className="text-muted small">You have no new notifications.</p>
        </div>
      ) : (
        <div className="glass-card p-0 overflow-hidden">
          <ul className="list-group list-group-flush">
            {notifications.map(n => (
              <li key={n.id} className={`list-group-item p-4 ${n.read ? 'bg-transparent' : 'bg-primary bg-opacity-10'}`}>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex gap-3 align-items-start">
                    <div className={`mt-1 rounded-circle p-2 ${n.read ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-primary text-white shadow-sm'}`}>
                      <Bell size={18} />
                    </div>
                    <div>
                      <h6 className={`mb-1 ${n.read ? 'text-muted' : 'fw-bold text-dark'}`}>
                        {n.title || 'System Notification'}
                      </h6>
                      <p className={`mb-1 ${n.read ? 'text-muted' : 'text-dark'}`}>{n.message}</p>
                      <div className="d-flex gap-3 align-items-center text-muted small mt-2">
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                        {n.applicationId && (
                          <Link to={`/applications/${n.applicationId}`} className="badge bg-primary text-decoration-none">View Application</Link>
                        )}
                      </div>
                    </div>
                  </div>
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="btn btn-sm btn-light text-primary border rounded-circle p-2" title="Mark as read">
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

export default CitizenNotifications;
