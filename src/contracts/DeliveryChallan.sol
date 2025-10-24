// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./IUserAccess.sol";

contract DeliveryChallan {
    enum Status { Created, InTransit, Delivered, Cancelled }

    struct Challan {
        uint id;
        uint orderId;
        address sender;
        address receiver;
        string[] tagIds;
        string crop;
        uint quantity;
        Status status;
        uint createdAt;
        uint updatedAt;
    }

    uint public challanCount;
    mapping(uint => Challan) public challans;

    IUserAccess public userAccess;

    event ChallanCreated(uint indexed id, uint orderId, address indexed sender, address indexed receiver);
    event ChallanStatusUpdated(uint indexed id, Status newStatus);

    constructor(address _userAccess) {
        require(_userAccess != address(0), "Invalid access address");
        userAccess = IUserAccess(_userAccess);
    }

    modifier onlySender(uint _id) {
        require(_id > 0 && _id <= challanCount, "Invalid challan ID");
        Challan storage c = challans[_id];
        require(
            c.sender == msg.sender || userAccess.hasRole(msg.sender, "ADMIN"),
            "Not authorized"
        );
        _;
    }

    function createChallan(
        uint _orderId,
        address _receiver,
        string calldata _crop,
        uint _quantity,
        string[] calldata _tagIds
    ) external {
        require(_receiver != address(0), "Receiver cannot be zero");
        require(_quantity > 0, "Quantity must be > 0");

        challanCount++;
        Challan storage c = challans[challanCount];
        c.id = challanCount;
        c.orderId = _orderId;
        c.sender = msg.sender;
        c.receiver = _receiver;
        c.crop = _crop;
        c.quantity = _quantity;
        c.status = Status.Created;
        c.createdAt = block.timestamp;
        c.updatedAt = block.timestamp;

        for (uint i = 0; i < _tagIds.length; i++) {
            c.tagIds.push(_tagIds[i]);
        }

        emit ChallanCreated(challanCount, _orderId, msg.sender, _receiver);
    }

    function updateStatus(uint _id, Status _newStatus) public onlySender(_id) {
        Challan storage c = challans[_id];
        require(c.id != 0, "Challan does not exist");
        c.status = _newStatus;
        c.updatedAt = block.timestamp;
        emit ChallanStatusUpdated(_id, _newStatus);
    }

    function markInTransit(uint _id) external onlySender(_id) {
        updateStatus(_id, Status.InTransit);
    }

    function markDelivered(uint _id) external onlySender(_id) {
        updateStatus(_id, Status.Delivered);
    }

    function getChallan(uint _id) external view returns (Challan memory) {
        require(_id > 0 && _id <= challanCount, "Invalid challan ID");
        return challans[_id];
    }
}
