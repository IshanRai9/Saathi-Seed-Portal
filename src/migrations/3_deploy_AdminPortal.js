const AdminPortal = artifacts.require("AdminPortal");

module.exports = function (deployer) {
  deployer.deploy(AdminPortal);
};