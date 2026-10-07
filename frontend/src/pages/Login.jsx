import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userProfile = await login(formData);
      if (userProfile?.roles?.includes('ROLE_SUPER_ADMIN') || userProfile?.roles?.includes('ROLE_DEPT_ADMIN')) {
        navigate('/admin/dashboard');
      } else if (userProfile?.roles?.includes('ROLE_OFFICER')) {
        navigate('/officer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials or server error.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="text-center mb-4">
          <LogIn size={48} className="text-primary mb-2" />
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted">Sign in to your MahaSeva account</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username or Email</label>
            <input type="text" name="usernameOrEmail" className="form-control auth-input" onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control auth-input" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold auth-btn">Sign In</button>
        </form>
        <div className="text-center mt-4">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" className="text-decoration-none fw-bold">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
