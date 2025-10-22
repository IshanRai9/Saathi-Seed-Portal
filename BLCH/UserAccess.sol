// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

/// @title UserAccess - Simple role management (Admin, DEALER, INSPECTOR, FARMER, GOV)
contract UserAccess {
    address public admin;

    mapping(address => string) public roles; // e.g. "ADMIN", "DEALER", "INSPECTOR"
    mapping(address => bool) public active;

    event RoleAssigned(address indexed user, string role);
    event UserDeactivated(address indexed user);
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyActive(address user) {
        require(active[user], "User not active");
        _;
    }

    constructor() {
        admin = msg.sender;
        roles[msg.sender] = "ADMIN";
        active[msg.sender] = true;
        emit RoleAssigned(msg.sender, "ADMIN");
    }

    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Zero addr");
        address old = admin;
        admin = _newAdmin;
        roles[_newAdmin] = "ADMIN";
        active[_newAdmin] = true;
        emit AdminTransferred(old, _newAdmin);
        emit RoleAssigned(_newAdmin, "ADMIN");
    }

    function assignRole(address _user, string calldata _role) external onlyAdmin {
        require(_user != address(0), "Zero addr");
        roles[_user] = _role;
        active[_user] = true;
        emit RoleAssigned(_user, _role);
    }

    function deactivateUser(address _user) external onlyAdmin {
        active[_user] = false;
        emit UserDeactivated(_user);
    }

    function hasRole(address _user, string calldata _role) public view returns (bool) {
        return (keccak256(bytes(roles[_user])) == keccak256(bytes(_role))) && active[_user];
    }
}
