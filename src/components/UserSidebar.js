import React from "react";
import "../styles/UserSidebar.css";

const UserSidebar = ({ setActiveTab, activeTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "catalog", label: "Seed Catalog", icon: "🌱" },
    { id: "purchases", label: "My Purchases", icon: "🛒" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="user-sidebar">
      <div className="sidebar-header">
        <h2>User Portal</h2>
        <p>Welcome back!</p>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default UserSidebar;

