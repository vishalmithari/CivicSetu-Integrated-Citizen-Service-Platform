import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', firstName: '', lastName: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="text-center mb-4">
          <UserPlus size={48} className="text-primary mb-2" />
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-muted">Join MahaSeva today</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-control auth-input" onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-control auth-input" onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-control auth-input" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control auth-input" onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control auth-input" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold auth-btn">Register</button>
        </form>
        <div className="text-center mt-4">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="text-decoration-none fw-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
