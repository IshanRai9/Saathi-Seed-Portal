import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserPortal, updateProfile } from "../Utils/web3";
import { withErrorHandling } from "../Utils/errorHandling";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    role: "Customer",
    walletAddress: "",
    registrationDate: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  const { currentUser, walletAddress } = useAuth();
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    if (currentUser && walletAddress) {
      loadUserProfile();
    }
  }, [currentUser, walletAddress]);

  const loadUserProfile = async () => {
    try {
      // Use withErrorHandling to handle blockchain errors
      await withErrorHandling(async () => {
        // Try to load data from blockchain
        const userPortalInstance = await getUserPortal();
        
        if (!userPortalInstance) {
          throw new Error("Failed to load user portal contract");
        }
        
        // Clear any previous errors
        setProfileError(null);
        
        // For now, we'll still use mock data but with proper error handling
        // In a real implementation, you would fetch this data from the contract
        setProfile({
          name: "John Doe",
          email: "john.doe@example.com",
          address: "123 Farm Street, Agriculture City, AC 12345",
          phone: "+1 (555) 123-4567",
          role: "Customer",
          walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
          registrationDate: "2024-01-01"
        });
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // This would typically save to smart contract
      console.log("Saving profile:", profile);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleCancel = () => {
    loadUserProfile(); // Reset to original data
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="save-button"
                onClick={handleSave}
              >
                Save Changes
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              <span>👤</span>
            </div>
            <div className="profile-basic">
              <h2>{profile.name}</h2>
              <p className="profile-role">{profile.role}</p>
              <p className="profile-email">{profile.email}</p>
            </div>
          </div>

          <div className="profile-details">
            <h3>Account Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? "editable" : "readonly"}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? "editable" : "readonly"}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? "editable" : "readonly"}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={isEditing ? "editable" : "readonly"}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="readonly"
                />
              </div>

              <div className="form-group">
                <label>Registration Date</label>
                <input
                  type="text"
                  value={profile.registrationDate}
                  disabled
                  className="readonly"
                />
              </div>
            </div>
          </div>

          <div className="wallet-info">
            <h3>Wallet Information</h3>
            <div className="wallet-address">
              <label>Wallet Address</label>
              <div className="address-display">
                <code>{profile.walletAddress}</code>
                <button 
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText(profile.walletAddress)}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

