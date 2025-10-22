import React, { useEffect, useState } from "react";
import getWeb3 from "../Utils/web3";
import AdminPortal from "../src/contracts/AdminPortal.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { getAdminPortal } from "../Utils/web3";
import { withErrorHandling } from "../Utils/errorHandling";
import "../styles/Dashboard.css";

const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalVarieties: 0,
    totalQuantity: 0,
    totalCost: 0,
  });
  const [chartData, setChartData] = useState([]);

  const loadDashboard = async () => {
    try {
      // Use withErrorHandling to handle blockchain errors
      await withErrorHandling(async () => {
        // Try to load data from blockchain
        const adminPortalInstance = await getAdminPortal();
        
        if (!adminPortalInstance) {
          throw new Error("Failed to load admin portal contract");
        }
        
        // Clear any previous errors
        setDashboardError(null);
        
        // Now use the adminPortalInstance instead of creating a new contract instance

        // For now, using mock data until contract is fully integrated
        // In a real implementation, you would use:
        // const data = await adminPortalInstance.methods.getDashboardMetrics().call();

        const newData = {
          totalVarieties: 15,
          totalQuantity: 5000,
          totalCost: 12500
        };

        setDashboard(newData);
        setChartData([
          { name: "Varieties", value: newData.totalVarieties },
          { name: "Quantity", value: newData.totalQuantity },
          { name: "Cost", value: newData.totalCost },
        ]);
      });
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  const { currentUser, walletAddress, userRole } = useAuth();
  const [dashboardError, setDashboardError] = useState(null);

  // Load dashboard initially and auto-refresh every 10 seconds
  useEffect(() => {
    // Only load dashboard data if user is authenticated and has admin role
    if (currentUser && walletAddress && (userRole === 'Admin' || userRole === 'SuperAdmin')) {
      loadDashboard();
      const interval = setInterval(loadDashboard, 10000); // auto-refresh
      return () => clearInterval(interval);
    }
  }, [currentUser, walletAddress, userRole]);

  return (
    <div className="dashboard-container">
      <h2>📊 Admin Dashboard</h2>
      <div className="dashboard-cards">
        <div className="dash-card">
          <h3>{dashboard.totalVarieties}</h3>
          <p>Seed Varieties</p>
        </div>
        <div className="dash-card">
          <h3>{dashboard.totalQuantity}</h3>
          <p>Total Quantity</p>
        </div>
        <div className="dash-card">
          <h3>₹{dashboard.totalCost}</h3>
          <p>Total Inventory Value</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>📈 Inventory Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>📊 Distribution Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
