import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PortalNavigation from "./components/PortalNavigation";
import AdminPortal from "./Pages/AdminPortal";
import UserPortal from "./Pages/UserPortal";

const App = () => {
  return (
    <Router>
      <div className="app">
        <PortalNavigation />
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/*" element={<AdminPortal />} />
          <Route path="/user/*" element={<UserPortal />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
