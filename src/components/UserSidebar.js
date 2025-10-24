import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/UserSidebar.css";

const UserSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/user/dashboard" },
    { id: "catalog", label: "Seed Catalog", icon: "🌱", path: "/user/catalog" },
    { id: "purchases", label: "My Purchases", icon: "🛒", path: "/user/purchases" },
    { id: "profile", label: "Profile", icon: "👤", path: "/user/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-sidebar">
      <div className="sidebar-header">
        <h2>User Portal</h2>
        <p>Welcome back!</p>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserSidebar;

