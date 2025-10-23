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
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = AdminPortalContract.networks[networkId];
        if (!networkData) {
          setManagementError("Smart contract not deployed to the connected network");
          return;
        }

        const instance = new web3.eth.Contract(
          AdminPortalContract.abi,
          networkData.address
        );
        setContract(instance);

        await fetchUsers(instance, accounts[0]);
        setManagementError(null);
      });
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
      const userAddresses = await instance.methods.userList().call();
      const fetchedUsers = [];
      for (let i = 0; i < userAddresses.length; i++) {
        const userAddr = userAddresses[i];
        const u = await instance.methods.users(userAddr).call();
        fetchedUsers.push({
          address: userAddr,
          name: u.name,
          role: parseInt(u.role),
          isActive: u.isActive,
        });
      }
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setManagementError("Failed to fetch users. Check console for details.");
    }
  };

  const addUser = async () => {
    if (!newUser.address || !newUser.name) return alert("Fill all fields");
    setLoading(true);
    try {
      await contract.methods
        .addUser(newUser.address, newUser.name, newUser.role)
        .send({ from: account });
      alert("✅ User added successfully");
      setNewUser({ address: "", name: "", role: 1 });
      await fetchUsers(contract, account);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add user");
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
