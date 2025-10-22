import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserPortal } from "../Utils/web3";
import { withErrorHandling } from "../Utils/errorHandling";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const [userStats, setUserStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    favoriteCrop: "None",
    lastPurchase: "Never"
  });

  const [recentPurchases, setRecentPurchases] = useState([]);
  const [availableSeeds, setAvailableSeeds] = useState([]);

  const { currentUser, walletAddress } = useAuth();
  const [dashboardError, setDashboardError] = useState(null);

  useEffect(() => {
    // Load user dashboard data when user is authenticated
    if (currentUser && walletAddress) {
      loadUserData();
    }
  }, [currentUser, walletAddress]);

  const loadUserData = async () => {
    try {
      // Use withErrorHandling to handle blockchain errors
      await withErrorHandling(async () => {
        // Try to load data from blockchain
        const userPortalInstance = await getUserPortal();
        
        if (!userPortalInstance) {
          throw new Error("Failed to load user portal contract");
        }
        
        // Clear any previous errors
        setDashboardError(null);
        
        // For now, we'll still use mock data but with proper error handling
        // In a real implementation, you would fetch this data from the contract
        setUserStats({
          totalPurchases: 12,
          totalSpent: 2450.50,
          favoriteCrop: "Wheat",
          lastPurchase: "2024-01-15"
        });

        setRecentPurchases([
          {
            id: "PUR-001",
            seedName: "Premium Wheat Seeds",
            quantity: 50,
            price: 125.00,
            date: "2024-01-15",
            status: "Delivered"
          },
          {
            id: "PUR-002", 
            seedName: "Organic Rice Seeds",
            quantity: 30,
            price: 89.50,
            date: "2024-01-10",
            status: "In Transit"
          }
        ]);

        setAvailableSeeds([
          {
            id: "SEED-001",
            name: "Hybrid Corn Seeds",
            variety: "Golden Harvest",
            price: 2.50,
            quantity: 1000,
            certification: "Organic"
          },
          {
            id: "SEED-002",
            name: "Premium Wheat Seeds", 
            variety: "Winter King",
            price: 2.00,
            quantity: 500,
            certification: "Certified"
          }
        ]);
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{userStats.totalPurchases}</h3>
            <p>Total Purchases</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${userStats.totalSpent.toFixed(2)}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌾</div>
          <div className="stat-content">
            <h3>{userStats.favoriteCrop}</h3>
            <p>Favorite Crop</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{userStats.lastPurchase}</h3>
            <p>Last Purchase</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Purchases */}
        <div className="dashboard-section">
          <h2>Recent Purchases</h2>
          <div className="purchases-list">
            {recentPurchases.map((purchase) => (
              <div key={purchase.id} className="purchase-card">
                <div className="purchase-header">
                  <h4>{purchase.seedName}</h4>
                  <span className={`status-badge status-${purchase.status.toLowerCase().replace(' ', '-')}`}>
                    {purchase.status}
                  </span>
                </div>
                <div className="purchase-details">
                  <div className="purchase-detail">
                    <span>Quantity:</span>
                    <span>{purchase.quantity} units</span>
                  </div>
                  <div className="purchase-detail">
                    <span>Price:</span>
                    <span>${purchase.price.toFixed(2)}</span>
                  </div>
                  <div className="purchase-detail">
                    <span>Date:</span>
                    <span>{purchase.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Seeds */}
        <div className="dashboard-section">
          <h2>Available Seeds</h2>
          <div className="seeds-list">
            {availableSeeds.map((seed) => (
              <div key={seed.id} className="seed-card">
                <div className="seed-header">
                  <h4>{seed.name}</h4>
                  <span className="seed-price">${seed.price}/unit</span>
                </div>
                <div className="seed-details">
                  <div className="seed-detail">
                    <span>Variety:</span>
                    <span>{seed.variety}</span>
                  </div>
                  <div className="seed-detail">
                    <span>Available:</span>
                    <span>{seed.quantity} units</span>
                  </div>
                  <div className="seed-detail">
                    <span>Certification:</span>
                    <span>{seed.certification}</span>
                  </div>
                </div>
                <button className="buy-button">Buy Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

