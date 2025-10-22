import React, { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import UserDashboard from "../components/UserDashboard";
import UserProfile from "../components/UserProfile";
import SeedCatalog from "../components/SeedCatalog";
import PurchaseHistory from "../components/PurchaseHistory";
import "../styles/UserPortal.css";

const UserPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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

