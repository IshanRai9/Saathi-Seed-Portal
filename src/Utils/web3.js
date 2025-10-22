import Web3 from "web3";
// Update import paths to match the actual location of contract JSON files
import AdminPortalContract from "../contracts/build/contracts/AdminPortal.json";
import UserPortalContract from "../contracts/build/contracts/UserPortal.json";

let web3;
let adminPortal;
let userPortal;

export const getWeb3 = async () => {
  if (web3) {
    return web3;
  }

  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("User denied account access");
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    web3 = new Web3("http://localhost:7545");
  }
  
  return web3;
};

const getAdminPortal = async () => {
  if (adminPortal) {
    return adminPortal;
  }

  const web3Instance = await getWeb3();
  const networkId = await web3Instance.eth.net.getId();
  const deployedNetwork = AdminPortalContract.networks[networkId];
  
  if (deployedNetwork) {
    adminPortal = new web3Instance.eth.Contract(
      AdminPortalContract.abi,
      deployedNetwork.address
    );
  } else {
    console.error("AdminPortal contract not found on this network");
  }
  
  return adminPortal;
};

const getUserPortal = async () => {
  if (userPortal) {
    return userPortal;
  }

  const web3Instance = await getWeb3();
  const networkId = await web3Instance.eth.net.getId();
  const deployedNetwork = UserPortalContract.networks[networkId];
  
  if (deployedNetwork) {
    userPortal = new web3Instance.eth.Contract(
      UserPortalContract.abi,
      deployedNetwork.address
    );
  } else {
    console.error("UserPortal contract not found on this network");
  }
  
  return userPortal;
};

// User Portal Helper Functions
export const userPortalHelpers = {
  // Register a new user
  registerUser: async (name, email, address, phone) => {
    try {
      const userPortalInstance = await getUserPortal();
      const accounts = await web3.eth.getAccounts();
      
      const result = await userPortalInstance.methods
        .registerUser(name, email, address, phone)
        .send({ from: accounts[0] });
      
      return result;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (name, email, address, phone) => {
    try {
      const userPortalInstance = await getUserPortal();
      const accounts = await web3.eth.getAccounts();
      
      const result = await userPortalInstance.methods
        .updateProfile(name, email, address, phone)
        .send({ from: accounts[0] });
      
      return result;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userAddress) => {
    try {
      const userPortalInstance = await getUserPortal();
      const profile = await userPortalInstance.methods
        .getUserProfile(userAddress)
        .call();
      
      return profile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },

  // Create a purchase
  createPurchase: async (purchaseId, seedId, quantity) => {
    try {
      const userPortalInstance = await getUserPortal();
      const accounts = await web3.eth.getAccounts();
      
      const result = await userPortalInstance.methods
        .createPurchase(purchaseId, seedId, quantity)
        .send({ from: accounts[0] });
      
      return result;
    } catch (error) {
      console.error("Error creating purchase:", error);
      throw error;
    }
  },

  // Get user purchases
  getUserPurchases: async (userAddress) => {
    try {
      const userPortalInstance = await getUserPortal();
      const purchases = await userPortalInstance.methods
        .getUserPurchases(userAddress)
        .call();
      
      return purchases;
    } catch (error) {
      console.error("Error getting user purchases:", error);
      throw error;
    }
  },

  // Get purchase details
  getPurchaseDetails: async (purchaseId) => {
    try {
      const userPortalInstance = await getUserPortal();
      const purchase = await userPortalInstance.methods
        .getPurchaseDetails(purchaseId)
        .call();
      
      return purchase;
    } catch (error) {
      console.error("Error getting purchase details:", error);
      throw error;
    }
  },

  // Get purchase history
  getPurchaseHistory: async (userAddress) => {
    try {
      const userPortalInstance = await getUserPortal();
      const history = await userPortalInstance.methods
        .getPurchaseHistory(userAddress)
        .call();
      
      return history;
    } catch (error) {
      console.error("Error getting purchase history:", error);
      throw error;
    }
  },

  // Get purchase stats
  getPurchaseStats: async (userAddress) => {
    try {
      const userPortalInstance = await getUserPortal();
      const stats = await userPortalInstance.methods
        .getPurchaseStats(userAddress)
        .call();
      
      return {
        totalPurchases: stats[0],
        totalSpent: stats[1],
        deliveredCount: stats[2],
        pendingCount: stats[3],
        cancelledCount: stats[4]
      };
    } catch (error) {
      console.error("Error getting purchase stats:", error);
      throw error;
    }
  },

  // Cancel purchase
  cancelPurchase: async (purchaseId) => {
    try {
      const userPortalInstance = await getUserPortal();
      const accounts = await web3.eth.getAccounts();
      
      const result = await userPortalInstance.methods
        .cancelPurchase(purchaseId)
        .send({ from: accounts[0] });
      
      return result;
    } catch (error) {
      console.error("Error cancelling purchase:", error);
      throw error;
    }
  }
};

// Admin Portal Helper Functions (existing functionality)
export const adminPortalHelpers = {
  // Get all seeds
  getAllSeeds: async () => {
    try {
      const adminPortalInstance = await getAdminPortal();
      const seeds = await adminPortalInstance.methods.getAllSeeds().call();
      return seeds;
    } catch (error) {
      console.error("Error getting all seeds:", error);
      throw error;
    }
  },

  // Search seed
  searchSeed: async (seedId) => {
    try {
      const adminPortalInstance = await getAdminPortal();
      const seed = await adminPortalInstance.methods.searchSeed(seedId).call();
      return seed;
    } catch (error) {
      console.error("Error searching seed:", error);
      throw error;
    }
  },

  // Add seed
  addSeed: async (seedData) => {
    try {
      const adminPortalInstance = await getAdminPortal();
      const accounts = await web3.eth.getAccounts();
      
      const result = await adminPortalInstance.methods
        .addSeed(
          seedData.seedID,
          seedData.cropName,
          seedData.variety,
          seedData.lotNumber,
          seedData.certificationType,
          seedData.tagNumber,
          seedData.quantity,
          seedData.pricePerUnit
        )
        .send({ from: accounts[0] });
      
      return result;
    } catch (error) {
      console.error("Error adding seed:", error);
      throw error;
    }
  },

  // Get dashboard metrics
  getDashboardMetrics: async () => {
    try {
      const adminPortalInstance = await getAdminPortal();
      const metrics = await adminPortalInstance.methods.getDashboardMetrics().call();
      return {
        totalVarieties: metrics[0],
        totalQuantity: metrics[1],
        totalCost: metrics[2]
      };
    } catch (error) {
      console.error("Error getting dashboard metrics:", error);
      throw error;
    }
  }
};

export default getWeb3;
export { getAdminPortal, getUserPortal };
