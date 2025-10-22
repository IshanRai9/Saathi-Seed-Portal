// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./AdminPortal.sol";

contract UserPortal {
    enum OrderStatus { Pending, Confirmed, Shipped, Delivered, Cancelled }
    
    struct Purchase {
        string purchaseId;
        string seedId;
        address buyer;
        uint256 quantity;
        uint256 unitPrice;
        uint256 totalPrice;
        OrderStatus status;
        uint256 timestamp;
        string trackingNumber;
    }
    
    struct UserProfile {
        string name;
        string email;
        string userAddress;
        string phone;
        bool isActive;
        uint256 registrationDate;
    }
    
    mapping(address => UserProfile) public userProfiles;
    mapping(string => Purchase) public purchases; // purchaseId => Purchase
    mapping(address => string[]) public userPurchases; // user => purchaseIds[]
    
    string[] public allPurchaseIds;
    address[] public registeredUsers;
    
    AdminPortal public adminPortal;
    address public owner;
    
    // EVENTS
    event UserRegistered(address indexed user, string name, string email);
    event ProfileUpdated(address indexed user, string name, string email);
    event PurchaseCreated(string indexed purchaseId, address indexed buyer, string seedId, uint256 quantity, uint256 totalPrice);
    event PurchaseStatusUpdated(string indexed purchaseId, OrderStatus newStatus);
    event TrackingUpdated(string indexed purchaseId, string trackingNumber);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyRegisteredUser() {
        require(userProfiles[msg.sender].isActive, "User not registered or inactive");
        _;
    }
    
    modifier validPurchase(string memory _purchaseId) {
        require(bytes(purchases[_purchaseId].purchaseId).length > 0, "Purchase not found");
        _;
    }
    
    constructor(address _adminPortalAddress) {
        owner = msg.sender;
        adminPortal = AdminPortal(_adminPortalAddress);
    }
    
    // -----------------------------
    // User Registration & Profile
    // -----------------------------
    function registerUser(
        string memory _name,
        string memory _email,
        string memory _userAddress,
        string memory _phone
    ) public {
        require(!userProfiles[msg.sender].isActive, "User already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        userProfiles[msg.sender] = UserProfile({
            name: _name,
            email: _email,
            userAddress: _userAddress,
            phone: _phone,
            isActive: true,
            registrationDate: block.timestamp
        });
        
        registeredUsers.push(msg.sender);
        emit UserRegistered(msg.sender, _name, _email);
    }
    
    function updateProfile(
        string memory _name,
        string memory _email,
        string memory _userAddress,
        string memory _phone
    ) public onlyRegisteredUser {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        userProfiles[msg.sender].name = _name;
        userProfiles[msg.sender].email = _email;
        userProfiles[msg.sender].userAddress = _userAddress;
        userProfiles[msg.sender].phone = _phone;
        
        emit ProfileUpdated(msg.sender, _name, _email);
    }
    
    function deactivateUser(address _user) public onlyOwner {
        require(userProfiles[_user].isActive, "User not active");
        userProfiles[_user].isActive = false;
    }
    
    // -----------------------------
    // Purchase Management
    // -----------------------------
    function createPurchase(
        string memory _purchaseId,
        string memory _seedId,
        uint256 _quantity
    ) public onlyRegisteredUser {
        require(bytes(purchases[_purchaseId].purchaseId).length == 0, "Purchase ID already exists");
        
        // Get seed details from AdminPortal
        (bool success, bytes memory data) = address(adminPortal).call(
            abi.encodeWithSignature("searchSeed(string)", _seedId)
        );
        
        require(success, "Failed to fetch seed details");
        
        // Decode seed data (simplified - in real implementation, you'd need proper ABI)
        // For now, we'll use a mock price
        uint256 unitPrice = 2 ether; // Mock price
        uint256 totalPrice = _quantity * unitPrice;
        
        purchases[_purchaseId] = Purchase({
            purchaseId: _purchaseId,
            seedId: _seedId,
            buyer: msg.sender,
            quantity: _quantity,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
            status: OrderStatus.Pending,
            timestamp: block.timestamp,
            trackingNumber: ""
        });
        
        userPurchases[msg.sender].push(_purchaseId);
        allPurchaseIds.push(_purchaseId);
        
        emit PurchaseCreated(_purchaseId, msg.sender, _seedId, _quantity, totalPrice);
    }
    
    function updatePurchaseStatus(
        string memory _purchaseId,
        OrderStatus _newStatus
    ) public onlyOwner validPurchase(_purchaseId) {
        purchases[_purchaseId].status = _newStatus;
        emit PurchaseStatusUpdated(_purchaseId, _newStatus);
    }
    
    function updateTrackingNumber(
        string memory _purchaseId,
        string memory _trackingNumber
    ) public onlyOwner validPurchase(_purchaseId) {
        purchases[_purchaseId].trackingNumber = _trackingNumber;
        emit TrackingUpdated(_purchaseId, _trackingNumber);
    }
    
    function cancelPurchase(string memory _purchaseId) public validPurchase(_purchaseId) {
        Purchase storage purchase = purchases[_purchaseId];
        require(purchase.buyer == msg.sender || msg.sender == owner, "Not authorized to cancel this purchase");
        require(purchase.status == OrderStatus.Pending || purchase.status == OrderStatus.Confirmed, "Cannot cancel this purchase");
        
        purchase.status = OrderStatus.Cancelled;
        emit PurchaseStatusUpdated(_purchaseId, OrderStatus.Cancelled);
    }
    
    // -----------------------------
    // View Functions
    // -----------------------------
    function getUserPurchases(address _user) public view returns (string[] memory) {
        return userPurchases[_user];
    }
    
    function getPurchaseDetails(string memory _purchaseId) public view validPurchase(_purchaseId) returns (Purchase memory) {
        return purchases[_purchaseId];
    }
    
    function getUserProfile(address _user) public view returns (UserProfile memory) {
        return userProfiles[_user];
    }
    
    function getPurchaseHistory(address _user) public view returns (Purchase[] memory) {
        string[] memory userPurchaseIds = userPurchases[_user];
        Purchase[] memory userPurchasesList = new Purchase[](userPurchaseIds.length);
        
        for (uint i = 0; i < userPurchaseIds.length; i++) {
            userPurchasesList[i] = purchases[userPurchaseIds[i]];
        }
        
        return userPurchasesList;
    }
    
    function getTotalPurchases(address _user) public view returns (uint256) {
        return userPurchases[_user].length;
    }
    
    function getTotalSpent(address _user) public view returns (uint256) {
        string[] memory userPurchaseIds = userPurchases[_user];
        uint256 total = 0;
        
        for (uint i = 0; i < userPurchaseIds.length; i++) {
            Purchase memory purchase = purchases[userPurchaseIds[i]];
            if (purchase.status != OrderStatus.Cancelled) {
                total += purchase.totalPrice;
            }
        }
        
        return total;
    }
    
    function getPurchaseStats(address _user) public view returns (
        uint256 totalPurchases,
        uint256 totalSpent,
        uint256 deliveredCount,
        uint256 pendingCount,
        uint256 cancelledCount
    ) {
        string[] memory userPurchaseIds = userPurchases[_user];
        totalPurchases = userPurchaseIds.length;
        
        for (uint i = 0; i < userPurchaseIds.length; i++) {
            Purchase memory purchase = purchases[userPurchaseIds[i]];
            
            if (purchase.status != OrderStatus.Cancelled) {
                totalSpent += purchase.totalPrice;
            }
            
            if (purchase.status == OrderStatus.Delivered) {
                deliveredCount++;
            } else if (purchase.status == OrderStatus.Pending || purchase.status == OrderStatus.Confirmed || purchase.status == OrderStatus.Shipped) {
                pendingCount++;
            } else if (purchase.status == OrderStatus.Cancelled) {
                cancelledCount++;
            }
        }
    }
    
    function getAllRegisteredUsers() public view returns (address[] memory) {
        return registeredUsers;
    }
    
    function getRegisteredUsersCount() public view returns (uint256) {
        return registeredUsers.length;
    }
}
