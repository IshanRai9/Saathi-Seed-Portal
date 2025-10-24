import { useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UserSidebar from "../components/UserSidebar";
import UserProfile from "../components/UserProfile";
import SeedCatalog from "../components/SeedCatalog";
import PurchaseHistory from "../components/PurchaseHistory";
import UserDashboard from "../components/UserDashboard";
import "../styles/UserPortal.css";

const UserPortal = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  return (
    <div className="user-portal">
      <UserSidebar />
      <div className="user-content">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="catalog" element={<SeedCatalog />} />
          <Route path="purchases" element={<PurchaseHistory />} />
          <Route path="profile" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserPortal;

