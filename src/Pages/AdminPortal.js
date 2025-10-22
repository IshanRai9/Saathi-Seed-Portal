import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement";
import SeedRegistration from "./SeedRegistration";
import "../styles/AdminPortal.css";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
