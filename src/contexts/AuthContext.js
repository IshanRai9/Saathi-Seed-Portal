import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWeb3 } from '../Utils/web3';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const web3 = await getWeb3();
        
        // Get connected accounts
        const accounts = await web3.eth.getAccounts();
        
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          
          // Here you would typically fetch user data from your contract
          // For now, we'll just set the user as authenticated if wallet is connected
          setCurrentUser({
            address: accounts[0],
            // Other user data would be fetched from contract
          });
          
          // Fetch user role from contract (mock for now)
          setUserRole('Customer'); // Default role
        }
      } catch (err) {
        console.error('Failed to initialize authentication:', err);
        setError('Failed to connect to blockchain. Please make sure MetaMask is installed and connected.');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // User has disconnected their wallet
          logout();
        } else {
          // User switched accounts
          setWalletAddress(accounts[0]);
          // Reload user data with new account
          initializeAuth();
        }
      });
    }

    return () => {
      // Clean up listeners when component unmounts
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setLoading(true);
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        // Fetch user data from contract
        // For now just set basic user data
        setCurrentUser({
          address: accounts[0],
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setWalletAddress(null);
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!userRole) return false;
    
    // Simple role check for now
    // In a real app, you might have a hierarchy of roles
    if (requiredRole === 'Admin') {
      return userRole === 'Admin' || userRole === 'SuperAdmin';
    }
    if (requiredRole === 'Producer') {
      return userRole === 'Producer' || userRole === 'Admin' || userRole === 'SuperAdmin';
    }
    if (requiredRole === 'Distributor') {
      return userRole === 'Distributor' || userRole === 'Admin' || userRole === 'SuperAdmin';
    }
    if (requiredRole === 'Customer') {
      return true; // Everyone can access customer features
    }
    
    return false;
  };

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    walletAddress,
    connectWallet,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};