import { useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import UserManagement from "../components/UserManagement";
import SeedRegistration from "../components/SeedRegistration";
import "../styles/AdminPortal.css";

const AdminPortal = () => {
  const { currentUser, userRole, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && (!currentUser || !(userRole === 'Admin' || userRole === 'SuperAdmin'))) {
      navigate('/login');
    }
  }, [currentUser, userRole, loading, navigate]);

  return (
    <div className="admin-portal">
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="seed-registration" element={<SeedRegistration />} />
          <Route path="user-management" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPortal;
