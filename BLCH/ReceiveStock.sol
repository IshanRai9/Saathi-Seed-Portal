// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./ISeedTrace.sol";
import "./IUserAccess.sol";

contract ReceiveStock {
    ISeedTrace public seedTrace;
    IUserAccess public userAccess;

    struct ReceiveOrder {
        uint id;
        uint orderId; // optional external order ref
        address receiver;
        string tagId;
        bool received;
        uint timestampRequested;
        uint timestampReceived;
    }

    uint public receiveCount;
    mapping(uint => ReceiveOrder) public receiveOrders;

    event ReceiveRequested(uint indexed id, uint orderId, address indexed receiver, string tagId);
    event StockReceived(uint indexed id, uint timestamp);

    constructor(address _seedTrace, address _userAccess) {
        seedTrace = ISeedTrace(_seedTrace);
        userAccess = IUserAccess(_userAccess);
    }

    modifier onlyReceiver() {
        require(userAccess.hasRole(msg.sender, "DEALER") || userAccess.hasRole(msg.sender, "ADMIN"), "Only dealer/admin");
        _;
    }

    function requestReceive(uint _orderId, string calldata _tagId) external onlyReceiver {
        // OrderID could match a sale or challan created by seller
        require(seedTrace.verifyTag(_tagId), "Invalid tag");
        receiveCount++;
        receiveOrders[receiveCount] = ReceiveOrder(receiveCount, _orderId, msg.sender, _tagId, false, block.timestamp, 0);
        emit ReceiveRequested(receiveCount, _orderId, msg.sender, _tagId);
    }

    function confirmReceive(uint _id) external {
        ReceiveOrder storage r = receiveOrders[_id];
        require(r.id != 0, "Invalid id");
        require(!r.received, "Already received");
        // Only receiver or admin can confirm
        require(r.receiver == msg.sender || userAccess.hasRole(msg.sender, "ADMIN"), "Not allowed");
        // transfer ownership (re-affirm)
        seedTrace.setOwner(r.tagId, r.receiver);
        r.received = true;
        r.timestampReceived = block.timestamp;
        emit StockReceived(_id, block.timestamp);
    }

    function getReceiveOrder(uint _id) external view returns (ReceiveOrder memory) {
        return receiveOrders[_id];
    }
}
