// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract AdminPortal {
    enum Role { None, Admin, Producer, Distributor, Customer }

    struct User {
        string name;
        Role role;
        bool isActive;
    }

    struct Seed {
        string seedID;
        string cropName;
        string variety;
        string lotNumber;
        string certificationType;
        string tagNumber;
        address currentOwner;
        string status;
        uint256 timestamp;
        uint256 pricePerUnit;
        uint256 quantity;
    }

    struct Sale {
        string seedID;
        address buyer;
        uint256 quantity;
        uint256 totalPrice;
        uint256 timestamp;
    }

    mapping(address => User) public users;
    address[] public userList;

    mapping(string => Seed) public seeds; // seedID => Seed
    string[] public allSeedIDs;

    Sale[] public sales;

    address public superAdmin;

    // EVENTS
    event UserAdded(address indexed addedBy, address indexed user, string name, Role role);
    event SeedAdded(string seedID, string cropName, uint256 quantity, uint256 pricePerUnit);
    event SeedUpdated(string seedID, uint256 quantity, uint256 pricePerUnit);
    event SeedSold(string seedID, address buyer, uint256 quantity, uint256 totalPrice);

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Only Super Admin can perform this action");
        _;
    }

    modifier onlyAdmin() {
        require(
            msg.sender == superAdmin || (users[msg.sender].role == Role.Admin && users[msg.sender].isActive),
            "Only active admin can perform this action"
        );
        _;
    }

    constructor() {
        superAdmin = msg.sender;
        users[msg.sender] = User("Super Admin", Role.Admin, true);
        userList.push(msg.sender);
    }

    // -----------------------------
    // User Management
    // -----------------------------
    function addUser(address _user, string memory _name, Role _role) public onlyAdmin {
        require(_user != address(0), "Invalid address");
        require(users[_user].role == Role.None, "User already exists");
        users[_user] = User(_name, _role, true);
        userList.push(_user);
        emit UserAdded(msg.sender, _user, _name, _role);
    }

    function lockUnlockUser(address _user, bool _isActive) public onlyAdmin {
        require(users[_user].role != Role.None, "User does not exist");
        users[_user].isActive = _isActive;
    }

    // -----------------------------
    // Seed Inventory
    // -----------------------------
    function addSeed(
        string memory _seedID,
        string memory _cropName,
        string memory _variety,
        string memory _lotNumber,
        string memory _certType,
        string memory _tagNumber,
        uint256 _quantity,
        uint256 _pricePerUnit
    ) public onlyAdmin {
        require(bytes(seeds[_seedID].seedID).length == 0, "Seed already exists");

        seeds[_seedID] = Seed({
            seedID: _seedID,
            cropName: _cropName,
            variety: _variety,
            lotNumber: _lotNumber,
            certificationType: _certType,
            tagNumber: _tagNumber,
            currentOwner: msg.sender,
            status: "Registered",
            timestamp: block.timestamp,
            quantity: _quantity,
            pricePerUnit: _pricePerUnit
        });

        allSeedIDs.push(_seedID);
        emit SeedAdded(_seedID, _cropName, _quantity, _pricePerUnit);
    }

    function updateSeed(
        string memory _seedID,
        uint256 _quantity,
        uint256 _pricePerUnit
    ) public onlyAdmin {
        require(bytes(seeds[_seedID].seedID).length > 0, "Seed not found");
        seeds[_seedID].quantity = _quantity;
        seeds[_seedID].pricePerUnit = _pricePerUnit;
        seeds[_seedID].timestamp = block.timestamp;
        emit SeedUpdated(_seedID, _quantity, _pricePerUnit);
    }

    function sellSeed(string memory _seedID, uint256 _quantity, address _buyer) public onlyAdmin {
        Seed storage s = seeds[_seedID];
        require(bytes(s.seedID).length > 0, "Seed not found");
        require(s.quantity >= _quantity, "Not enough quantity");

        uint256 totalPrice = _quantity * s.pricePerUnit;
        s.quantity -= _quantity;
        s.currentOwner = _buyer;
        s.status = "Sold";
        s.timestamp = block.timestamp;

        sales.push(Sale(_seedID, _buyer, _quantity, totalPrice, block.timestamp));
        emit SeedSold(_seedID, _buyer, _quantity, totalPrice);
    }

    // -----------------------------
    // Search & Dashboard
    // -----------------------------
    function searchSeed(string memory _seedID) public view returns (Seed memory) {
        require(bytes(seeds[_seedID].seedID).length > 0, "Seed not found");
        return seeds[_seedID];
    }

    function getDashboardMetrics() public view returns (
        uint256 totalVarieties,
        uint256 totalQuantity,
        uint256 totalCost
    ) {
        // count unique varieties
        string[] memory uniqueVarieties = new string[](allSeedIDs.length);
        uint256 varietyCount = 0;
        uint256 quantitySum = 0;
        uint256 costSum = 0;

        for (uint i = 0; i < allSeedIDs.length; i++) {
            Seed memory s = seeds[allSeedIDs[i]];
            quantitySum += s.quantity;
            costSum += s.quantity * s.pricePerUnit;

            // check if variety already counted
            bool exists = false;
            for (uint j = 0; j < varietyCount; j++) {
                if (keccak256(bytes(uniqueVarieties[j])) == keccak256(bytes(s.variety))) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                uniqueVarieties[varietyCount] = s.variety;
                varietyCount++;
            }
        }
        return (varietyCount, quantitySum, costSum);
    }
}
