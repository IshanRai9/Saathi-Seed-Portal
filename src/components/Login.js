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
    if (currentUser) {
      // Redirect based on user role
      if (userRole === 'Admin' || userRole === 'SuperAdmin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  }, [currentUser, userRole, navigate]);

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
          <h1>🌱 Saathi Seed Portal</h1>
          <p>Connect your wallet to access the portal</p>
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
            <h3>About Saathi Seed Portal</h3>
            <p>
              Saathi Seed Portal is a blockchain-based seed traceability and inventory 
              management system that ensures transparency in seed movement throughout 
              the agricultural supply chain.
            </p>
            <p>
              To use this application, you need a Web3 wallet like MetaMask installed 
              in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;