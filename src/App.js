import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PortalNavigation from "./components/PortalNavigation";
import AdminPortal from "./Pages/AdminPortal";
import UserPortal from "./Pages/UserPortal";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Login";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <PortalNavigation />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/*" element={<AdminPortal />} />
            <Route path="/user/*" element={<UserPortal />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
