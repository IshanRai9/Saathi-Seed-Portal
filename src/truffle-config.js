// SPDX-License-Identifier: MIT
// Truffle Configuration File

module.exports = {
  // Directory where your compiled contract JSON files will be stored
  contracts_build_directory: "./contracts/build/contracts",

  networks: {
    // ✅ Local Ganache Network
    development: {
      host: "127.0.0.1",   // Localhost (default: Ganache)
      port: 7545,          // Port number used by Ganache
      network_id: "5777",  // Match your Ganache network ID
    },
  },

  // ✅ Solidity compiler configuration
  compilers: {
    solc: {
      version: "0.8.0",   // Use Solidity 0.8.0 specifically
      settings: {
        optimizer: {
          enabled: true,  // Enable optimization
          runs: 200,      // Optimize for how many times the code runs
        },
      },
    },
  },

  // ✅ Mocha testing configuration (optional)
  mocha: {
    timeout: 100000, // Increase timeout if needed for blockchain tests
  },
};
