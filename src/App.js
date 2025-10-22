import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import SeedRegistration from "./components/SeedRegistration";
import UserManagement from "./components/UserManagement";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: "70px", padding: "20px" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/seed-registration" element={<SeedRegistration />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
