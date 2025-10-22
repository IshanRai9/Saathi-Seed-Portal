// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

/**
 * @title Seed Traceability and Inventory Management
 * @dev SAATHI Project — ensures transparency in seed movement using blockchain
 */

contract SeedTrace {
    // ----------------------------- STRUCTS -----------------------------
    struct Seed {
        string seedID;
        string cropName;
        string variety;
        string lotNumber;
        string certificationType;
        string tagNumber;
        address currentOwner;
        string status; // Registered, Sold, Purchased, Received, Delivered
        uint256 timestamp;
    }

    struct DeliveryChallan {
        string challanID;
        string seedID;
        address from;
        address to;
        uint256 quantity;
        uint256 date;
    }

    // ----------------------------- MAPPINGS -----------------------------
    mapping(string => Seed) public seeds;
    mapping(string => DeliveryChallan) public challans;
    string[] public allSeedIDs;
    string[] public allChallanIDs;

    // ----------------------------- EVENTS -----------------------------
    event SeedRegistered(string seedID, address owner);
    event SeedTransferred(string seedID, address from, address to);
    event DeliveryChallanGenerated(string challanID, string seedID, address from, address to, uint256 quantity);

    // ----------------------------- MODIFIERS -----------------------------
    modifier seedExists(string memory _seedID) {
        require(bytes(seeds[_seedID].seedID).length > 0, "Seed not found");
        _;
    }

    modifier onlyOwner(string memory _seedID) {
        require(msg.sender == seeds[_seedID].currentOwner, "Not authorized owner");
        _;
    }

    // ----------------------------- SEED REGISTRATION -----------------------------
    function registerSeed(
        string memory _seedID,
        string memory _cropName,
        string memory _variety,
        string memory _lotNumber,
        string memory _certType,
        string memory _tagNumber
    ) public {
        require(bytes(seeds[_seedID].seedID).length == 0, "Seed already registered");

        Seed memory newSeed = Seed({
            seedID: _seedID,
            cropName: _cropName,
            variety: _variety,
            lotNumber: _lotNumber,
            certificationType: _certType,
            tagNumber: _tagNumber,
            currentOwner: msg.sender,
            status: "Registered",
            timestamp: block.timestamp
        });

        seeds[_seedID] = newSeed;
        allSeedIDs.push(_seedID);
        emit SeedRegistered(_seedID, msg.sender);
    }

    // ----------------------------- TRANSFER SEED -----------------------------
    function transferSeed(
        string memory _seedID,
        address _newOwner
    ) public seedExists(_seedID) onlyOwner(_seedID) {
        address prevOwner = seeds[_seedID].currentOwner;
        seeds[_seedID].currentOwner = _newOwner;
        seeds[_seedID].status = "Sold";
        seeds[_seedID].timestamp = block.timestamp;
        emit SeedTransferred(_seedID, prevOwner, _newOwner);
    }

    // ----------------------------- PURCHASE SEED -----------------------------
    function purchaseSeed(
        string memory _seedID
    ) public seedExists(_seedID) {
        require(msg.sender != seeds[_seedID].currentOwner, "Already owned");
        seeds[_seedID].currentOwner = msg.sender;
        seeds[_seedID].status = "Purchased";
        seeds[_seedID].timestamp = block.timestamp;
    }

    // ----------------------------- RECEIVE SEED -----------------------------
    function receiveSeed(
        string memory _seedID
    ) public seedExists(_seedID) {
        seeds[_seedID].status = "Received";
        seeds[_seedID].timestamp = block.timestamp;
    }

    // ----------------------------- GENERATE DELIVERY CHALLAN -----------------------------
    function generateDeliveryChallan(
        string memory _challanID,
        string memory _seedID,
        address _to,
        uint256 _quantity
    ) public seedExists(_seedID) onlyOwner(_seedID) {
        require(bytes(challans[_challanID].challanID).length == 0, "Challan already exists");

        DeliveryChallan memory newChallan = DeliveryChallan({
            challanID: _challanID,
            seedID: _seedID,
            from: msg.sender,
            to: _to,
            quantity: _quantity,
            date: block.timestamp
        });

        challans[_challanID] = newChallan;
        allChallanIDs.push(_challanID);

        emit DeliveryChallanGenerated(_challanID, _seedID, msg.sender, _to, _quantity);
    }

    // ----------------------------- GET SEED DETAILS -----------------------------
    function getSeedDetails(string memory _seedID)
        public
        view
        seedExists(_seedID)
        returns (
            string memory seedID,
            string memory cropName,
            string memory variety,
            string memory lotNumber,
            string memory certificationType,
            string memory tagNumber,
            address currentOwner,
            string memory status,
            uint256 timestamp
        )
    {
        Seed memory s = seeds[_seedID];
        return (
            s.seedID,
            s.cropName,
            s.variety,
            s.lotNumber,
            s.certificationType,
            s.tagNumber,
            s.currentOwner,
            s.status,
            s.timestamp
        );
    }

    // ----------------------------- GET ALL SEEDS -----------------------------
    function getAllSeeds() public view returns (Seed[] memory) {
        Seed[] memory all = new Seed[](allSeedIDs.length);
        for (uint i = 0; i < allSeedIDs.length; i++) {
            all[i] = seeds[allSeedIDs[i]];
        }
        return all;
    }

    // ----------------------------- GET DELIVERY CHALLAN DETAILS -----------------------------
    function getDeliveryChallan(string memory _challanID)
        public
        view
        returns (
            string memory challanID,
            string memory seedID,
            address from,
            address to,
            uint256 quantity,
            uint256 date
        )
    {
        DeliveryChallan memory c = challans[_challanID];
        return (c.challanID, c.seedID, c.from, c.to, c.quantity, c.date);
    }

    // ----------------------------- GET ALL CHALLANS -----------------------------
    function getAllChallans() public view returns (DeliveryChallan[] memory) {
        DeliveryChallan[] memory all = new DeliveryChallan[](allChallanIDs.length);
        for (uint i = 0; i < allChallanIDs.length; i++) {
            all[i] = challans[allChallanIDs[i]];
        }
        return all;
    }

    // ----------------------------- VERIFY SEED -----------------------------
    function verifySeed(string memory _seedID)
        public
        view
        seedExists(_seedID)
        returns (bool)
    {
        // If seed exists in blockchain, it's authentic
        return bytes(seeds[_seedID].seedID).length > 0;
    }
}
