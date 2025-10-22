import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserPortal } from "../Utils/web3";
import { withErrorHandling } from "../Utils/errorHandling";
import "../styles/SeedCatalog.css";

const SeedCatalog = () => {
  const [seeds, setSeeds] = useState([]);
  const [filteredSeeds, setFilteredSeeds] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    cropType: "",
    certification: "",
    priceRange: ""
  });
  const [loading, setLoading] = useState(true);

  const { currentUser, walletAddress } = useAuth();
  const [catalogError, setCatalogError] = useState(null);

  useEffect(() => {
    if (currentUser && walletAddress) {
      loadSeeds();
    }
  }, [currentUser, walletAddress]);

  useEffect(() => {
    applyFilters();
  }, [seeds, filters]);

  const loadSeeds = async () => {
    try {
      setLoading(true);
      // Use withErrorHandling to handle blockchain errors
      await withErrorHandling(async () => {
        // Try to load data from blockchain
        const userPortalInstance = await getUserPortal();
        
        if (!userPortalInstance) {
          throw new Error("Failed to load user portal contract");
        }
        
        // Clear any previous errors
        setCatalogError(null);
        
        // For now, we'll still use mock data but with proper error handling
        // In a real implementation, you would fetch this data from the contract
        const mockSeeds = [
          {
            id: "SEED-001",
            name: "Hybrid Corn Seeds",
            variety: "Golden Harvest",
            cropType: "Corn",
            price: 2.50,
            quantity: 1000,
            certification: "Organic",
            description: "High-yield hybrid corn seeds with excellent disease resistance.",
            image: "🌽"
          },
          {
            id: "SEED-002",
            name: "Premium Wheat Seeds",
            variety: "Winter King",
            cropType: "Wheat",
            price: 2.00,
            quantity: 500,
            certification: "Certified",
            description: "Premium winter wheat seeds for optimal yield.",
            image: "🌾"
          },
          {
            id: "SEED-003",
            name: "Organic Rice Seeds",
            variety: "Basmati Supreme",
            cropType: "Rice",
            price: 3.25,
            quantity: 300,
            certification: "Organic",
            description: "Premium organic basmati rice seeds.",
            image: "🍚"
          },
          {
            id: "SEED-004",
            name: "Tomato Seeds",
            variety: "Cherry Delight",
            cropType: "Vegetable",
            price: 1.75,
            quantity: 800,
            certification: "Certified",
            description: "Sweet cherry tomato seeds for home gardens.",
            image: "🍅"
          },
          {
            id: "SEED-005",
            name: "Soybean Seeds",
            variety: "Protein Plus",
            cropType: "Soybean",
            price: 2.80,
            quantity: 600,
            certification: "Certified",
            description: "High-protein soybean seeds for commercial farming.",
            image: "🫘"
          }
        ];
        setSeeds(mockSeeds);
      });
    } catch (error) {
      console.error("Error loading seeds:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = seeds;

    if (filters.search) {
      filtered = filtered.filter(seed =>
        seed.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        seed.variety.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.cropType) {
      filtered = filtered.filter(seed => seed.cropType === filters.cropType);
    }

    if (filters.certification) {
      filtered = filtered.filter(seed => seed.certification === filters.certification);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(seed => seed.price >= min && seed.price <= max);
    }

    setFilteredSeeds(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePurchase = async (seedId, quantity) => {
    try {
      // This would typically interact with smart contract
      console.log(`Purchasing ${quantity} units of seed ${seedId}`);
      alert(`Successfully purchased ${quantity} units!`);
    } catch (error) {
      console.error("Error purchasing seed:", error);
      alert("Error processing purchase. Please try again.");
    }
  };

  const getCropTypes = () => {
    const types = [...new Set(seeds.map(seed => seed.cropType))];
    return types;
  };

  const getCertifications = () => {
    const certs = [...new Set(seeds.map(seed => seed.certification))];
    return certs;
  };

  if (loading) {
    return (
      <div className="seed-catalog">
        <div className="loading">Loading seeds...</div>
      </div>
    );
  }

  return (
    <div className="seed-catalog">
      <div className="catalog-header">
        <h1>Seed Catalog</h1>
        <p>Browse and purchase high-quality seeds</p>
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
              placeholder="Search seeds..."
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Crop Type</label>
            <select
              name="cropType"
              value={filters.cropType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Types</option>
              {getCropTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Certification</label>
            <select
              name="certification"
              value={filters.certification}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Certifications</option>
              {getCertifications().map(cert => (
                <option key={cert} value={cert}>{cert}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Prices</option>
              <option value="0-2">$0 - $2</option>
              <option value="2-3">$2 - $3</option>
              <option value="3-5">$3+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results-section">
        <div className="results-header">
          <h2>Available Seeds ({filteredSeeds.length})</h2>
        </div>

        <div className="seeds-grid">
          {filteredSeeds.map(seed => (
            <div key={seed.id} className="seed-card">
              <div className="seed-image">
                <span className="seed-emoji">{seed.image}</span>
              </div>
              
              <div className="seed-content">
                <div className="seed-header">
                  <h3>{seed.name}</h3>
                  <span className="seed-price">${seed.price}/unit</span>
                </div>
                
                <div className="seed-variety">{seed.variety}</div>
                <div className="seed-description">{seed.description}</div>
                
                <div className="seed-details">
                  <div className="seed-detail">
                    <span>Type:</span>
                    <span>{seed.cropType}</span>
                  </div>
                  <div className="seed-detail">
                    <span>Certification:</span>
                    <span className={`cert-badge cert-${seed.certification.toLowerCase()}`}>
                      {seed.certification}
                    </span>
                  </div>
                  <div className="seed-detail">
                    <span>Available:</span>
                    <span>{seed.quantity} units</span>
                  </div>
                </div>

                <div className="seed-actions">
                  <div className="quantity-selector">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      max={seed.quantity}
                      defaultValue="1"
                      className="quantity-input"
                    />
                  </div>
                  <button
                    className="purchase-button"
                    onClick={() => handlePurchase(seed.id, 1)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSeeds.length === 0 && (
          <div className="no-results">
            <p>No seeds found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedCatalog;

