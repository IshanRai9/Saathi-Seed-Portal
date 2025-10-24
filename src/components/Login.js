import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { withErrorHandling } from '../Utils/errorHandling';
import '../styles/Login.css';

const Login = () => {
  const { currentUser, connectWallet, loading, error, userRole } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('user');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userRole && !loading) {
      // Redirect based on user role
      if (userRole === 'Admin' || userRole === 'SuperAdmin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  }, [currentUser, userRole, loading, navigate]);

  const handleConnectWallet = async () => {
    setConnecting(true);
    setLoginError(null);

    try {
      await withErrorHandling(
        async () => {
          const success = await connectWallet(selectedRole);
          if (!success) {
            setLoginError('Failed to connect wallet. Please try again.');
          }
        },
        setLoginError
      );
    } catch (err) {
      // Error is already handled by withErrorHandling
      console.log('Login error handled');
    } finally {
      setConnecting(false);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <img src="/logo-hindi.png" alt="Government Logo" className="gov-logo" />
            <div className="header-text">
              <h1>Saathi Seed Portal</h1>
              <p className="subtitle">सरकारी बीज ट्रेसेबिलिटी पोर्टल</p>
              <p className="tagline">Government Seed Traceability & Management System</p>
            </div>
          </div>
        </div>

        <div className="login-content">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {loginError && (
            <div className="error-message">
              <p>{loginError}</p>
            </div>
          )}

          <div className="role-selection">
            <p>Select your role:</p>
            <div className="role-options">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={selectedRole === 'user'}
                  onChange={handleRoleChange}
                />
                <span>User</span>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={selectedRole === 'admin'}
                  onChange={handleRoleChange}
                />
                <span>Admin</span>
              </label>
            </div>
          </div>

          <button
            className="connect-wallet-btn"
            onClick={handleConnectWallet}
            disabled={connecting || loading}
          >
            {connecting ? 'Connecting...' : `Connect as ${selectedRole === 'admin' ? 'Admin' : 'User'}`}
          </button>

          <div className="login-info">
            <div className="info-section">
              <h3>🔐 Secure Access</h3>
              <p>This portal uses blockchain technology to ensure secure and transparent seed traceability.</p>
            </div>
            <div className="info-section">
              <h3>📋 Requirements</h3>
              <p>A Web3 wallet (MetaMask) is required for authentication and secure access.</p>
            </div>
            <div className="footer-text">
              <p>© Government of India | Ministry of Agriculture & Farmers Welfare</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;