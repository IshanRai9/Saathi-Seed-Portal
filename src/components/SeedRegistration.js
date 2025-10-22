import React, { useEffect, useState } from "react";
import getWeb3 from "../Utils/web3";
import { useAuth } from "../contexts/AuthContext";
import { getAdminPortal } from "../Utils/web3";
import { withErrorHandling } from "../Utils/errorHandling";
import AdminPortal from "../src/contracts/AdminPortal.json";
import "../styles/SeedRegistration.css";

const SeedRegistration = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [dashboard, setDashboard] = useState({
    totalVarieties: 0,
    totalQuantity: 0,
    totalCost: 0,
  });
  const [formData, setFormData] = useState({
    seedID: "",
    cropName: "",
    variety: "",
    lotNumber: "",
    certificationType: "",
    tagNumber: "",
    quantity: "",
    pricePerUnit: "",
  });
  const [searchID, setSearchID] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AdminPortal.networks[networkId];
      if (deployedNetwork) {
        const instance = new web3.eth.Contract(
          AdminPortal.abi,
          deployedNetwork.address
        );
        setContract(instance);
        loadDashboard(instance);
      } else {
        alert("Contract not deployed to detected network.");
      }
    };
    loadContract();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { currentUser, walletAddress, userRole } = useAuth();
  const [registrationError, setRegistrationError] = useState(null);
  const [registering, setRegistering] = useState(false);

  const registerSeed = async () => {
    // Check if user is authenticated and has admin role
    if (!currentUser || !walletAddress || !(userRole === 'Admin' || userRole === 'SuperAdmin')) {
      alert("You don't have permission to register seeds");
      return;
    }
    
    setRegistering(true);
    setRegistrationError(null);
    
    try {
      await withErrorHandling(async () => {
        const {
          seedID,
          cropName,
          variety,
          lotNumber,
          certificationType,
          tagNumber,
          quantity,
          pricePerUnit,
        } = formData;
        
        await contract.methods
          .addSeed(
            seedID,
            cropName,
            variety,
            lotNumber,
            certificationType,
            tagNumber,
            quantity,
            pricePerUnit
          )
          .send({ from: account });
        alert("✅ Seed Registered Successfully!");
        loadDashboard(contract);
      }, setRegistrationError);
    } catch (err) {
      console.log("Registration error handled");
    } finally {
      setRegistering(false);
    }
  };

  const searchSeed = async () => {
    try {
      const seed = await contract.methods.searchSeed(searchID).call();
      setSearchResult(seed);
    } catch {
      alert("❌ Seed not found!");
    }
  };

  const loadDashboard = async (instance) => {
    const data = await instance.methods.getDashboardMetrics().call();
    setDashboard({
      totalVarieties: data[0],
      totalQuantity: data[1],
      totalCost: data[2],
    });
  };

  return (
    <div className="seed-container">
      <h2>🌾 Seed Registration</h2>
      <p>Connected Account: {account}</p>

      <div className="dashboard">
        <div className="card">
          <h3>{dashboard.totalVarieties}</h3>
          <p>Varieties</p>
        </div>
        <div className="card">
          <h3>{dashboard.totalQuantity}</h3>
          <p>Total Quantity</p>
        </div>
        <div className="card">
          <h3>₹{dashboard.totalCost}</h3>
          <p>Total Cost</p>
        </div>
      </div>

      <div className="form-section">
        <h3>Add New Seed</h3>
        <div className="form-grid">
          {Object.keys(formData).map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
            />
          ))}
        </div>
        <button onClick={registerSeed}>Register Seed</button>
      </div>

      <div className="search-section">
        <h3>Search Seed</h3>
        <input
          type="text"
          placeholder="Enter Seed ID"
          value={searchID}
          onChange={(e) => setSearchID(e.target.value)}
        />
        <button onClick={searchSeed}>Search</button>

        {searchResult && (
          <div className="result-card">
            <h4>Seed Details</h4>
            <p><b>Crop:</b> {searchResult.cropName}</p>
            <p><b>Variety:</b> {searchResult.variety}</p>
            <p><b>Price:</b> ₹{searchResult.pricePerUnit}</p>
            <p><b>Qty:</b> {searchResult.quantity}</p>
            <p><b>Status:</b> {searchResult.status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedRegistration;
