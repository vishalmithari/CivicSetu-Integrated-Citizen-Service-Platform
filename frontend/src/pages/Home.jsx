import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar navbar-expand-lg glass-nav fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold gradient-text" to="/">MahaSeva</Link>
          <div className="d-flex gap-3">
            <Link to="/login" className="btn btn-outline-primary fw-medium px-4 rounded-pill">Login</Link>
            <Link to="/register" className="btn btn-primary fw-medium px-4 rounded-pill">Register</Link>
          </div>
        </div>
      </nav>

      <main className="hero-section text-center d-flex flex-column justify-content-center align-items-center">
        <div className="container position-relative z-1">
          <span className="badge bg-primary bg-opacity-10 text-primary mb-3 py-2 px-3 rounded-pill border border-primary">
            Unified Citizen Service Gateway
          </span>
          <h1 className="display-3 fw-bold mb-4 hero-title">
            Empowering Citizens Through <br /> <span className="gradient-text">Digital Governance</span>
          </h1>
          <p className="lead text-muted mb-5 max-w-2xl mx-auto">
            Access government services, track applications, and engage with departments seamlessly in one unified platform.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 d-flex align-items-center gap-2 shadow-lg">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>

          <div className="row mt-5 pt-5 g-4">
            <div className="col-md-4">
              <div className="glass-card feature-card p-4">
                <Globe className="text-primary mb-3" size={32} />
                <h5 className="fw-bold">Unified Access</h5>
                <p className="text-muted small">One portal for all your civic needs and applications.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card feature-card p-4">
                <ShieldCheck className="text-primary mb-3" size={32} />
                <h5 className="fw-bold">Secure Identity</h5>
                <p className="text-muted small">Robust authentication and role-based access control.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card feature-card p-4">
                <Users className="text-primary mb-3" size={32} />
                <h5 className="fw-bold">Direct Engagement</h5>
                <p className="text-muted small">Connect effortlessly with officers and departments.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract background blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </main>
    </div>
  );
};

export default Home;
