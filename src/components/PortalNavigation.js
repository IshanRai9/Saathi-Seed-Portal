import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/PortalNavigation.css";

const PortalNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userRole, logout } = useAuth();

  const isAdminPortal = location.pathname.startsWith('/admin');
  const isUserPortal = location.pathname.startsWith('/user');

  const handlePortalSwitch = (portal) => {
    if (portal === 'admin' && !isAdminPortal) {
      navigate('/admin');
    } else if (portal === 'user' && !isUserPortal) {
      navigate('/user');
    }
  };

  // Don't render navigation if user is not logged in
  if (!currentUser) {
    return null;
  }

  return (
    <div className="portal-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>🌱 Saathi Seed Portal</h2>
        </div>
        
        <div className="nav-portals">
          {/* Only show Admin Portal button if user has admin role */}
          {(userRole === 'Admin' || userRole === 'SuperAdmin') && (
            <button
              className={`nav-portal-btn ${isAdminPortal ? 'active' : ''}`}
              onClick={() => handlePortalSwitch('admin')}
            >
              <span className="portal-icon">👨‍💼</span>
              <span className="portal-label">Admin Portal</span>
            </button>
          )}
          
          <button
            className={`nav-portal-btn ${isUserPortal ? 'active' : ''}`}
            onClick={() => handlePortalSwitch('user')}
          >
            <span className="portal-icon">👤</span>
            <span className="portal-label">User Portal</span>
          </button>

          <button
            className="nav-portal-btn logout-button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <span className="portal-icon">🚪</span>
            <span className="portal-label">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortalNavigation;

