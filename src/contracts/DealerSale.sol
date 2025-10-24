// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./ISeedTrace.sol";
import "./IUserAccess.sol";

contract DealerSale {
    ISeedTrace public seedTrace;
    IUserAccess public userAccess;

    struct Sale {
        uint id;
        address seller;
        address buyer;
   
        string buyerType; // "DEALER","FARMER","GOV"
        string crop;
        uint quantity;
        string tagId;
        uint timestamp;
    }

    uint public saleCount;
    mapping(uint => Sale) public sales;

    event SaleCreated(uint indexed saleId, address indexed seller, address indexed buyer, string buyerType, string crop, uint quantity, string tagId, uint timestamp);

    constructor(address _seedTrace, address _userAccess) {
        seedTrace = ISeedTrace(_seedTrace);
        userAccess = IUserAccess(_userAccess);
    }

    modifier onlyAuthorizedSeller() {
        // seller must be active DEALER (or admin)
        require(userAccess.hasRole(msg.sender, "DEALER") || userAccess.hasRole(msg.sender, "ADMIN"), "Not authorized seller");
        _;
    }

    function _createSale(address _buyer, string memory _buyerType, string memory _crop, uint _qty, string memory _tagId) internal {
        require(_qty > 0, "Qty>0");
        require(seedTrace.verifyTag(_tagId), "Invalid tag");
        saleCount++;
        sales[saleCount] = Sale(saleCount, msg.sender, _buyer, _buyerType, _crop, _qty, _tagId, block.timestamp);
        // transfer ownership on SeedTrace
        seedTrace.setOwner(_tagId, _buyer);
        emit SaleCreated(saleCount, msg.sender, _buyer, _buyerType, _crop, _qty, _tagId, block.timestamp);
    }

    function sellToDealer(address _buyer, string calldata _crop, uint _qty, string calldata _tagId) external onlyAuthorizedSeller {
        require(userAccess.hasRole(_buyer, "DEALER") || userAccess.hasRole(_buyer, "ADMIN"), "Buyer not dealer");
        _createSale(_buyer, "DEALER", _crop, _qty, _tagId);
    }

    function sellToFarmer(address _farmer, string calldata _crop, uint _qty, string calldata _tagId) external onlyAuthorizedSeller {
        require(userAccess.hasRole(_farmer, "FARMER") || userAccess.hasRole(_farmer, "ADMIN"), "Buyer not farmer");
        _createSale(_farmer, "FARMER", _crop, _qty, _tagId);
    }

    function sellToGovAgency(address _agency, string calldata _crop, uint _qty, string calldata _tagId) external onlyAuthorizedSeller {
        require(userAccess.hasRole(_agency, "GOV") || userAccess.hasRole(_agency, "ADMIN"), "Buyer not gov");
        _createSale(_agency, "GOV", _crop, _qty, _tagId);
    }

    // helper read
    function getSale(uint _id) external view returns (Sale memory) {
        return sales[_id];
    }
}
