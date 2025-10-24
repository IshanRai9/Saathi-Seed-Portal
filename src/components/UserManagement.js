import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import getWeb3 from "../Utils/web3";
import { getAdminPortal } from "../Utils/web3";
import { withErrorHandling } from "../Utils/errorHandling";
import AdminPortalContract from "../contracts/build/contracts/AdminPortal.json";
import "../styles/UserManagement.css";

const UserManagement = () => {
  const { currentUser, walletAddress, userRole } = useAuth();
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    address: "",
    name: "",
    role: 1,
  });
  const [loading, setLoading] = useState(false);
  const [managementError, setManagementError] = useState(null);

  const loadBlockchain = useCallback(async () => {
    try {
      await withErrorHandling(async () => {
        console.log("Loading blockchain data...");
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found. Please connect your wallet.");
        }
        
        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);

        const networkId = await web3.eth.net.getId();
        console.log("Network ID:", networkId);
        
        const networkData = AdminPortalContract.networks[networkId];
        if (!networkData) {
          throw new Error(`Smart contract not deployed to network ${networkId}. Please switch to the correct network.`);
        }

        console.log("Contract address:", networkData.address);
        
        const instance = new web3.eth.Contract(
          AdminPortalContract.abi,
          networkData.address
        );
        setContract(instance);

        // Test contract connection
        try {
          const testCall = await instance.methods.userList().call();
          console.log("Contract connection successful, user count:", testCall.length);
        } catch (testError) {
          console.error("Contract test call failed:", testError);
          throw new Error("Contract connection failed. Please check if the contract is deployed correctly.");
        }

        await fetchUsers(instance, accounts[0]);
        setManagementError(null);
      }, setManagementError);
    } catch (err) {
      console.error("Blockchain load error:", err);
      setManagementError(err.message || "Failed to load blockchain data");
    }
  }, []);

  useEffect(() => {
    // Only load blockchain if user is authenticated and has appropriate role
    if (currentUser && walletAddress && (userRole === 'Admin' || userRole === 'SuperAdmin')) {
      loadBlockchain();
    }
  }, [loadBlockchain, currentUser, walletAddress, userRole]);

  const fetchUsers = async (instance, acc) => {
    try {
      console.log("Fetching users...");
      const userAddresses = await instance.methods.userList().call();
      console.log("User addresses found:", userAddresses.length);
      
      const fetchedUsers = [];
      for (let i = 0; i < userAddresses.length; i++) {
        const userAddr = userAddresses[i];
        try {
          const u = await instance.methods.users(userAddr).call();
          fetchedUsers.push({
            address: userAddr,
            name: u.name,
            role: parseInt(u.role),
            isActive: u.isActive,
          });
        } catch (userError) {
          console.error(`Error fetching user ${userAddr}:`, userError);
          // Continue with other users even if one fails
        }
      }
      setUsers(fetchedUsers);
      console.log("Users loaded successfully:", fetchedUsers.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      setManagementError(`Failed to fetch users: ${error.message}`);
    }
  };

  const addUser = async () => {
    if (!newUser.address || !newUser.name) {
      setManagementError("Please fill all fields");
      return;
    }

    if (!contract) {
      setManagementError("Smart contract not loaded. Please refresh the page.");
      return;
    }

    if (!account) {
      setManagementError("Wallet not connected. Please connect your wallet.");
      return;
    }

    setLoading(true);
    setManagementError(null);

    try {
      await withErrorHandling(async () => {
        // Validate Ethereum address format
        const web3 = await getWeb3();
        if (!web3.utils.isAddress(newUser.address)) {
          throw new Error("Invalid Ethereum address format");
        }

        // Check if user already exists
        try {
          const existingUser = await contract.methods.users(newUser.address).call();
          if (existingUser.name && existingUser.name !== "") {
            throw new Error("User with this address already exists");
          }
        } catch (checkError) {
          // If the call fails, it might mean the user doesn't exist, which is fine
          console.log("User check result:", checkError.message);
        }

        // Estimate gas before sending transaction
        const gasEstimate = await contract.methods
          .addUser(newUser.address, newUser.name, parseInt(newUser.role))
          .estimateGas({ from: account });

        console.log("Gas estimate:", gasEstimate);

        // Send transaction with estimated gas + buffer
        const result = await contract.methods
          .addUser(newUser.address, newUser.name, parseInt(newUser.role))
          .send({ 
            from: account,
            gas: Math.floor(gasEstimate * 1.2) // Add 20% buffer
          });

        console.log("Transaction result:", result);
        
        setManagementError(null);
        alert("✅ User added successfully");
        setNewUser({ address: "", name: "", role: 1 });
        await fetchUsers(contract, account);
      }, setManagementError);
    } catch (err) {
      console.error("Add user error:", err);
      const errorMessage = err.message || "Failed to add user";
      setManagementError(`Failed to add user: ${errorMessage}`);
    }
    setLoading(false);
  };

  const toggleUserStatus = async (address, status) => {
    setLoading(true);
    try {
      await contract.methods.lockUnlockUser(address, !status).send({ from: account });
      alert("🔁 User status updated");
      await fetchUsers(contract, account);
    } catch (err) {
      console.error(err);
      alert("❌ Error updating status");
    }
    setLoading(false);
  };

  const getRoleName = (roleId) => {
    const roles = ["None", "Admin", "Producer", "Distributor", "Customer"];
    return roles[roleId] || "Unknown";
  };

  return (
    <div className="user-container">
      <div className="user-header">
        <h2>👥 User Management</h2>
        <p>Manage users, roles, and activation status.</p>
        {managementError && (
          <div className="error-message">
            <p>❌ {managementError}</p>
          </div>
        )}
        
        {/* Debug Information */}
        <div className="debug-info">
          <p><strong>Status:</strong> {contract ? "✅ Contract Connected" : "❌ Contract Not Connected"}</p>
          <p><strong>Account:</strong> {account || "Not Connected"}</p>
          <p><strong>User Role:</strong> {userRole || "Unknown"}</p>
          <p><strong>Users Loaded:</strong> {users.length}</p>
        </div>
      </div>

      <div className="user-form">
        <input
          type="text"
          placeholder="User Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="1">Admin</option>
          <option value="2">Producer</option>
          <option value="3">Distributor</option>
          <option value="4">Customer</option>
        </select>
        <button onClick={addUser} disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </button>
        <button onClick={() => loadBlockchain()} disabled={loading}>
          🔄 Reload Contract
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={index}>
              <td>{u.address}</td>
              <td>{u.name}</td>
              <td>{getRoleName(u.role)}</td>
              <td className={u.isActive ? "active" : "inactive"}>
                {u.isActive ? "Active" : "Inactive"}
              </td>
              <td>
                <button
                  className={u.isActive ? "lock" : "unlock"}
                  onClick={() => toggleUserStatus(u.address, u.isActive)}
                >
                  {u.isActive ? "Lock" : "Unlock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
