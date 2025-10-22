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
      const web3 = await getWeb3();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AdminPortal.networks[networkId];

      if (!deployedNetwork) {
        console.error("Contract not deployed on this network!");
        return;
      }

      const instance = new web3.eth.Contract(
        AdminPortal.abi,
        deployedNetwork.address
      );

      const data = await instance.methods.getDashboardMetrics().call();

      const newData = {
        totalVarieties: parseInt(data[0]),
        totalQuantity: parseInt(data[1]),
        totalCost: parseInt(data[2]),
      };

      setDashboard(newData);

      // Create chart data dynamically
      setChartData([
        { name: "Varieties", value: newData.totalVarieties },
        { name: "Quantity", value: newData.totalQuantity },
        { name: "Cost", value: newData.totalCost },
      ]);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  // Load dashboard initially and auto-refresh every 10 seconds
  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

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
