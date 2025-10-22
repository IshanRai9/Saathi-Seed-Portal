import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import UserManagement from "../components/UserManagement";
import SeedRegistration from "../components/SeedRegistration";
import "../styles/AdminPortal.css";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { currentUser, userRole, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!currentUser || !(userRole === 'Admin' || userRole === 'SuperAdmin'))) {
      navigate('/login');
    }
  }, [currentUser, userRole, loading, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "seeds":
        return <SeedRegistration />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-portal">
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

export default AdminPortal;
