import React from "react";
import { NavLink } from "react-router-dom";
import { FaSeedling, FaUsersCog, FaChartPie } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        🌱
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <FaChartPie className="sidebar-icon" />
            <span className="sidebar-text">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/seed-registration"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <FaSeedling className="sidebar-icon" />
            <span className="sidebar-text">Seed Management</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user-management"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <FaUsersCog className="sidebar-icon" />
            <span className="sidebar-text">User Management</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
