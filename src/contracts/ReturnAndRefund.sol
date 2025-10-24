// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./ISeedTrace.sol";
import "./IUserAccess.sol";

contract ReturnAndRefund {
    ISeedTrace public seedTrace;
    IUserAccess public userAccess;

    enum ReturnStatus { Requested, Approved, Received, Rejected }

    struct ReturnRequest {
        uint id;
        uint saleId;         // optional reference to sale
        address requester;   // who requested return (buyer)
        address seller;      // original seller address
        string tagId;
        string reason;       // "DAMAGED","BLOCKED","EXPIRED","UNSOLD"
        ReturnStatus status;
        uint createdAt;
        uint updatedAt;
    }

    uint public returnCount;
    mapping(uint => ReturnRequest) public returnsMap;

    event ReturnRequested(uint indexed id, uint saleId, address indexed requester, string tagId, string reason);
    event ReturnApproved(uint indexed id);
    event ReturnReceived(uint indexed id);
    event ReturnRejected(uint indexed id);

    constructor(address _seedTrace, address _userAccess) {
        seedTrace = ISeedTrace(_seedTrace);
        userAccess = IUserAccess(_userAccess);
    }

    function requestReturn(uint _saleId, address _seller, string calldata _tagId, string calldata _reason) external {
        require(seedTrace.verifyTag(_tagId), "Invalid tag");
        returnCount++;
        returnsMap[returnCount] = ReturnRequest(returnCount, _saleId, msg.sender, _seller, _tagId, _reason, ReturnStatus.Requested, block.timestamp, block.timestamp);
        emit ReturnRequested(returnCount, _saleId, msg.sender, _tagId, _reason);
    }

    function approveReturn(uint _id) external {
        // only seller or admin approves
        ReturnRequest storage r = returnsMap[_id];
        require(r.id != 0, "No request");
        require(msg.sender == r.seller || userAccess.hasRole(msg.sender, "ADMIN"), "Not allowed");
        r.status = ReturnStatus.Approved;
        r.updatedAt = block.timestamp;
        emit ReturnApproved(_id);
    }

    function receiveReturnedStock(uint _id) external {
        ReturnRequest storage r = returnsMap[_id];
        require(r.id != 0, "No request");
        require(r.status == ReturnStatus.Approved, "Must be approved");
        // Only seller can mark received (or admin)
        require(msg.sender == r.seller || userAccess.hasRole(msg.sender, "ADMIN"), "Not allowed");
        // set tag owner back to seller (or as per process)
        seedTrace.setOwner(r.tagId, r.seller);
        r.status = ReturnStatus.Received;
        r.updatedAt = block.timestamp;
        emit ReturnReceived(_id);
    }

    function rejectReturn(uint _id) external {
        ReturnRequest storage r = returnsMap[_id];
        require(r.id != 0, "No request");
        require(msg.sender == r.seller || userAccess.hasRole(msg.sender, "ADMIN"), "Not allowed");
        r.status = ReturnStatus.Rejected;
        r.updatedAt = block.timestamp;
        emit ReturnRejected(_id);
    }

    function getReturn(uint _id) external view returns (ReturnRequest memory) {
        return returnsMap[_id];
    }
}
