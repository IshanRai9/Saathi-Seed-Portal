// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

/**
 * @title ISeedTrace
 * @dev Interface for the SeedTrace system used across DealerSale, ReceiveStock, etc.
 * Provides verification, ownership tracking, and status updates for tagged seeds.
 */
interface ISeedTrace {
    /**
     * @notice Verify whether a tagId exists or is valid in the system.
     * @param tagId Unique tag identifier.
     * @return True if tagId is valid, otherwise false.
     */
    function verifyTag(string calldata tagId) external view returns (bool);

    /**
     * @notice Update the current status of a tag (e.g., InTransit, Delivered, etc.).
     * @param tagId Unique tag identifier.
     * @param status New status string.
     */
    function updateTagStatus(string calldata tagId, string calldata status) external;

    /**
     * @notice Get complete details of a tag.
     * @param tagId Unique tag identifier.
     * @return batchId ID of the production batch.
     * @return crop Name of the crop.
     * @return variety Seed variety name.
     * @return quantity Quantity linked to this tag.
     * @return currentOwner Address currently owning this tag.
     */
    function getTagDetails(string calldata tagId)
        external
        view
        returns (
            string memory batchId,
            string memory crop,
            string memory variety,
            uint256 quantity,
            address currentOwner
        );

    /**
     * @notice Assign a new owner for a given tag (used during sale or transfer).
     * @param tagId Unique tag identifier.
     * @param newOwner Address of the new owner.
     */
    function setOwner(string calldata tagId, address newOwner) external;

    /**
     * @notice Returns the current owner address of a tag.
     * @param tagId Unique tag identifier.
     * @return The current owner's address.
     */
    function getOwner(string calldata tagId) external view returns (address);

    /**
     * @notice Record a new tag entry (optional: used in seed registration).
     * @param tagId Unique tag identifier.
     * @param batchId Production batch identifier.
     * @param crop Crop name.
     * @param variety Variety name.
     * @param quantity Quantity associated with this tag.
     * @param owner Initial owner address.
     */
    function recordTag(
        string calldata tagId,
        string calldata batchId,
        string calldata crop,
        string calldata variety,
        uint256 quantity,
        address owner
    ) external;
}
