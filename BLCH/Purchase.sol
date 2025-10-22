// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./IUserAccess.sol";

contract Purchase {
    IUserAccess public userAccess;

    struct SellerInfo {
        string sellerName;
        string licenseNo;
        string gstn;
        string pan;
        string phone;
        address sellerAddr;
    }

    struct PurchaseInfo {
        uint id;
        address buyer;
        SellerInfo seller;
        string crop;
        string variety;
        uint quantity;
        uint price;
        uint totalAmount;
        uint timestamp;
    }

    uint public purchaseCount;
    mapping(uint => PurchaseInfo) public purchases;

    event PurchaseCreated(
        uint indexed id,
        address indexed buyer,
        address indexed seller,
        string crop,
        string variety,
        uint quantity,
        uint price,
        uint totalAmount
    );

    constructor(address _userAccess) {
        userAccess = IUserAccess(_userAccess);
    }

    modifier onlyAuthorized() {
        require(
            userAccess.hasRole(msg.sender, "DEALER") ||
            userAccess.hasRole(msg.sender, "ADMIN"),
            "Not authorized"
        );
        _;
    }

    // ✅ Helper function to build SellerInfo (reduces stack depth)
    function _buildSellerInfo(
        string calldata _sellerName,
        string calldata _licenseNo,
        string calldata _gstn,
        string calldata _pan,
        string calldata _phone,
        address _sellerAddr
    ) internal pure returns (SellerInfo memory) {
        SellerInfo memory s;
        s.sellerName = _sellerName;
        s.licenseNo = _licenseNo;
        s.gstn = _gstn;
        s.pan = _pan;
        s.phone = _phone;
        s.sellerAddr = _sellerAddr;
        return s;
    }

    function createPurchase(
        string calldata _sellerName,
        string calldata _licenseNo,
        string calldata _gstn,
        string calldata _pan,
        string calldata _phone,
        address _sellerAddr,
        string calldata _crop,
        string calldata _variety,
        uint _quantity,
        uint _price
    ) external onlyAuthorized {
        require(_sellerAddr != address(0), "Invalid seller");
        require(_quantity > 0, "Quantity > 0");
        require(_price > 0, "Price > 0");

        purchaseCount++;
        uint totalAmount = _quantity * _price;

        // ✅ Create seller struct separately to reduce stack usage
        SellerInfo memory seller = _buildSellerInfo(
            _sellerName,
            _licenseNo,
            _gstn,
            _pan,
            _phone,
            _sellerAddr
        );

        // ✅ Store purchase in storage
        PurchaseInfo storage p = purchases[purchaseCount];
        p.id = purchaseCount;
        p.buyer = msg.sender;
        p.seller = seller;
        p.crop = _crop;
        p.variety = _variety;
        p.quantity = _quantity;
        p.price = _price;
        p.totalAmount = totalAmount;
        p.timestamp = block.timestamp;

        emit PurchaseCreated(
            purchaseCount,
            msg.sender,
            _sellerAddr,
            _crop,
            _variety,
            _quantity,
            _price,
            totalAmount
        );
    }

    function getPurchase(uint _id) external view returns (PurchaseInfo memory) {
        require(_id > 0 && _id <= purchaseCount, "Invalid purchase ID");
        return purchases[_id];
    }
}
