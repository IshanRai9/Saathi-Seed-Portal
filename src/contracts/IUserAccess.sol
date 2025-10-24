// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IUserAccess {
    // Returns true if the given user has the given role.
    function hasRole(address user, string calldata role) external view returns (bool);

    // Optional extra helper functions (based on your other contracts)
    function isAdmin(address user) external view returns (bool);
    function isDealer(address user) external view returns (bool);
    function isFarmer(address user) external view returns (bool);
}
