// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./ISeedTrace.sol";
import "./IUserAccess.sol";

contract MarkForTesting {
    ISeedTrace public seedTrace;
    IUserAccess public userAccess;

    struct TestRecord {
        string tagId;
        address inspector;
        bool passed;
        bool exists;
        uint markedAt;
        uint resultAt;
    }

    mapping(string => TestRecord) public tests; // tagId => test

    event TagMarkedForTesting(string indexed tagId, address indexed inspector, uint timestamp);
    event TestResultUpdated(string indexed tagId, address indexed inspector, bool passed, uint timestamp);

    constructor(address _seedTrace, address _userAccess) {
        seedTrace = ISeedTrace(_seedTrace);
        userAccess = IUserAccess(_userAccess);
    }

    modifier onlyInspectorOrAdmin() {
        require(userAccess.hasRole(msg.sender, "INSPECTOR") || userAccess.hasRole(msg.sender, "ADMIN"), "Only inspector/admin");
        _;
    }

    function markTagForTesting(string calldata _tagId, address _inspector) external {
        require(seedTrace.verifyTag(_tagId), "Invalid tag");
        // only admin or dealer (owner) can mark; simple rule: admin or owner
        address owner = seedTrace.getOwner(_tagId);
        require(msg.sender == owner || userAccess.hasRole(msg.sender, "ADMIN") || userAccess.hasRole(msg.sender, "DEALER"), "Not allowed to mark");
        tests[_tagId] = TestRecord(_tagId, _inspector, false, true, block.timestamp, 0);
        emit TagMarkedForTesting(_tagId, _inspector, block.timestamp);
    }

    function updateTestResult(string calldata _tagId, bool _passed) external onlyInspectorOrAdmin {
        TestRecord storage tr = tests[_tagId];
        require(tr.exists, "Not marked");
        tr.passed = _passed;
        tr.resultAt = block.timestamp;
        emit TestResultUpdated(_tagId, msg.sender, _passed, block.timestamp);
    }

    function getTestRecord(string calldata _tagId) external view returns (TestRecord memory) {
        return tests[_tagId];
    }
}
