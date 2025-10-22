import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UserSidebar from "../components/UserSidebar";
import UserProfile from "../components/UserProfile";
import SeedCatalog from "../components/SeedCatalog";
import PurchaseHistory from "../components/PurchaseHistory";
import UserDashboard from "../components/UserDashboard";
import "../styles/UserPortal.css";

const UserPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <UserProfile />;
      case "catalog":
        return <SeedCatalog />;
      case "purchases":
        return <PurchaseHistory />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="user-portal">
      <UserSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="user-content">{renderContent()}</div>
    </div>
  );
};

export default UserPortal;

