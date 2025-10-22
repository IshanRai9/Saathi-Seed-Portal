const UserPortal = artifacts.require("UserPortal");

module.exports = async function(deployer, network, accounts) {
  // Get the deployed AdminPortal address
  const AdminPortal = artifacts.require("AdminPortal");
  const adminPortal = await AdminPortal.deployed();
  
  console.log("AdminPortal deployed at:", adminPortal.address);
  
  // Deploy UserPortal with AdminPortal address
  await deployer.deploy(UserPortal, adminPortal.address);
  
  const userPortal = await UserPortal.deployed();
  console.log("UserPortal deployed at:", userPortal.address);
  
  // Optional: Register some test users
  if (network === "development") {
    console.log("Registering test users...");
    
    // Register test users
    const testUsers = [
      {
        address: accounts[1],
        name: "Alice Johnson",
        email: "alice@example.com",
        address: "123 Farm Street, Agriculture City, AC 12345",
        phone: "+1 (555) 123-4567"
      },
      {
        address: accounts[2],
        name: "Bob Smith",
        email: "bob@example.com",
        address: "456 Crop Lane, Farm Town, FT 67890",
        phone: "+1 (555) 987-6543"
      }
    ];
    
    for (const user of testUsers) {
      try {
        await userPortal.registerUser(
          user.name,
          user.email,
          user.address,
          user.phone,
          { from: user.address }
        );
        console.log(`Registered user: ${user.name} at ${user.address}`);
      } catch (error) {
        console.error(`Failed to register user ${user.name}:`, error.message);
      }
    }
  }
};

