// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract ReportManager {
    struct SaleReport {
        uint id;
        address seller;
        address buyer;
        string crop;
        uint quantity;
        string tagId;
        uint timestamp;
    }

    SaleReport[] public saleReports;

    event SaleReportAdded(
        uint indexed id,
        address indexed seller,
        address indexed buyer,
        string crop,
        uint quantity,
        string tagId,
        uint timestamp
    );

    /**
     * @notice Add a new sale report (usually called by DealerSale)
     */
    function addSaleReport(
        address _seller,
        address _buyer,
        string calldata _crop,
        uint _quantity,
        string calldata _tagId
    ) external {
        uint id = saleReports.length + 1;

        saleReports.push(
            SaleReport({
                id: id,
                seller: _seller,
                buyer: _buyer,
                crop: _crop,
                quantity: _quantity,
                tagId: _tagId,
                timestamp: block.timestamp
            })
        );

        emit SaleReportAdded(id, _seller, _buyer, _crop, _quantity, _tagId, block.timestamp);
    }

    /**
     * @notice Returns total number of sale reports
     */
    function getSaleReportsCount() external view returns (uint) {
        return saleReports.length;
    }

    /**
     * @notice Returns a paginated list of sale reports
     */
    function getSaleReports(uint start, uint count) external view returns (SaleReport[] memory) {
        uint total = saleReports.length;

        if (start >= total) {
            // ✅ Return an empty array instead of invalid expression
            SaleReport[] memory empty;
            return empty;
        }

        uint end = start + count;
        if (end > total) end = total;

        uint len = end - start;
        SaleReport[] memory out = new SaleReport[](len);

        for (uint i = 0; i < len; i++) {
            out[i] = saleReports[start + i];
        }

        return out;
    }
}
