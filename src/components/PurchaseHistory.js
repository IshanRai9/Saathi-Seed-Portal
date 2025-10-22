import React, { useState, useEffect } from "react";
import "../styles/PurchaseHistory.css";

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateRange: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [purchases, filters]);

  const loadPurchaseHistory = async () => {
    try {
      setLoading(true);
      // This would typically load from smart contract
      // For now, using mock data
      const mockPurchases = [
        {
          id: "PUR-001",
          seedName: "Premium Wheat Seeds",
          variety: "Winter King",
          quantity: 50,
          unitPrice: 2.00,
          totalPrice: 100.00,
          date: "2024-01-15",
          status: "Delivered",
          trackingNumber: "TRK-123456",
          seedId: "SEED-002"
        },
        {
          id: "PUR-002",
          seedName: "Organic Rice Seeds",
          variety: "Basmati Supreme",
          quantity: 30,
          unitPrice: 3.25,
          totalPrice: 97.50,
          date: "2024-01-10",
          status: "In Transit",
          trackingNumber: "TRK-123457",
          seedId: "SEED-003"
        },
        {
          id: "PUR-003",
          seedName: "Hybrid Corn Seeds",
          variety: "Golden Harvest",
          quantity: 25,
          unitPrice: 2.50,
          totalPrice: 62.50,
          date: "2024-01-05",
          status: "Delivered",
          trackingNumber: "TRK-123458",
          seedId: "SEED-001"
        },
        {
          id: "PUR-004",
          seedName: "Tomato Seeds",
          variety: "Cherry Delight",
          quantity: 100,
          unitPrice: 1.75,
          totalPrice: 175.00,
          date: "2023-12-28",
          status: "Cancelled",
          trackingNumber: null,
          seedId: "SEED-004"
        },
        {
          id: "PUR-005",
          seedName: "Soybean Seeds",
          variety: "Protein Plus",
          quantity: 40,
          unitPrice: 2.80,
          totalPrice: 112.00,
          date: "2023-12-20",
          status: "Delivered",
          trackingNumber: "TRK-123459",
          seedId: "SEED-005"
        }
      ];
      setPurchases(mockPurchases);
    } catch (error) {
      console.error("Error loading purchase history:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = purchases;

    if (filters.search) {
      filtered = filtered.filter(purchase =>
        purchase.seedName.toLowerCase().includes(filters.search.toLowerCase()) ||
        purchase.variety.toLowerCase().includes(filters.search.toLowerCase()) ||
        purchase.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(purchase => purchase.status === filters.status);
    }

    if (filters.dateRange) {
      const now = new Date();
      const daysAgo = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        return purchaseDate >= cutoffDate;
      });
    }

    setFilteredPurchases(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'in transit':
        return 'status-in-transit';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getTotalSpent = () => {
    return purchases
      .filter(p => p.status !== 'Cancelled')
      .reduce((total, purchase) => total + purchase.totalPrice, 0);
  };

  const getTotalPurchases = () => {
    return purchases.filter(p => p.status !== 'Cancelled').length;
  };

  if (loading) {
    return (
      <div className="purchase-history">
        <div className="loading">Loading purchase history...</div>
      </div>
    );
  }

  return (
    <div className="purchase-history">
      <div className="history-header">
        <h1>Purchase History</h1>
        <p>Track your seed purchases and orders</p>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{getTotalPurchases()}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${getTotalSpent().toFixed(2)}</h3>
            <p>Total Spent</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{purchases.filter(p => p.status === 'Delivered').length}</h3>
            <p>Delivered</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{purchases.filter(p => p.status === 'In Transit').length}</h3>
            <p>In Transit</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search purchases..."
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Delivered">Delivered</option>
              <option value="In Transit">In Transit</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range</label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchase List */}
      <div className="purchases-section">
        <div className="purchases-header">
          <h2>Your Purchases ({filteredPurchases.length})</h2>
        </div>

        <div className="purchases-list">
          {filteredPurchases.map(purchase => (
            <div key={purchase.id} className="purchase-card">
              <div className="purchase-header">
                <div className="purchase-title">
                  <h3>{purchase.seedName}</h3>
                  <span className="purchase-id">#{purchase.id}</span>
                </div>
                <div className="purchase-status">
                  <span className={`status-badge ${getStatusBadgeClass(purchase.status)}`}>
                    {purchase.status}
                  </span>
                </div>
              </div>

              <div className="purchase-details">
                <div className="purchase-info">
                  <div className="info-row">
                    <span className="info-label">Variety:</span>
                    <span className="info-value">{purchase.variety}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Quantity:</span>
                    <span className="info-value">{purchase.quantity} units</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Unit Price:</span>
                    <span className="info-value">${purchase.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Total Price:</span>
                    <span className="info-value total-price">${purchase.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">{purchase.date}</span>
                  </div>
                  {purchase.trackingNumber && (
                    <div className="info-row">
                      <span className="info-label">Tracking:</span>
                      <span className="info-value tracking-number">{purchase.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <div className="purchase-actions">
                  {purchase.status === 'Delivered' && (
                    <button className="action-button primary">
                      Leave Review
                    </button>
                  )}
                  {purchase.status === 'In Transit' && (
                    <button className="action-button secondary">
                      Track Package
                    </button>
                  )}
                  {purchase.status === 'Pending' && (
                    <button className="action-button danger">
                      Cancel Order
                    </button>
                  )}
                  <button className="action-button outline">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPurchases.length === 0 && (
          <div className="no-results">
            <p>No purchases found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;

