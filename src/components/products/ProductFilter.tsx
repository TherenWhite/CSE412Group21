import React, { useState, useEffect } from 'react';
import { ProductFilters, Store } from '../../types';
import './ProductFilter.css';

interface ProductFilterProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  stores: Store[];
}

const ProductFilter: React.FC<ProductFilterProps> = ({ filters, onFilterChange, stores }) => {
  const [category, setCategory] = useState<string>(filters.category || '');
  const [storeId, setStoreId] = useState<number | undefined>(filters.storeId);
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');
  const [zipCode, setZipCode] = useState<string>(filters.zipCode || '');
  
  //update state upon feature change
  useEffect(() => {
    setCategory(filters.category || '');
    setStoreId(filters.storeId);
    setMinPrice(filters.minPrice?.toString() || '');
    setMaxPrice(filters.maxPrice?.toString() || '');
    setZipCode(filters.zipCode || '');
  }, [filters]);
  
  const applyFilters = () => {
    const newFilters: ProductFilters = {};
    
    if (category) {
      newFilters.category = category;
    }
    
    if (storeId) {
      newFilters.storeId = storeId;
    }
    
    if (minPrice) {
      newFilters.minPrice = Number(minPrice);
    }
    
    if (maxPrice) {
      newFilters.maxPrice = Number(maxPrice);
    }
    
    if (zipCode) {
      newFilters.zipCode = zipCode;
    }
    
    //keep search term
    if (filters.searchTerm) {
      newFilters.searchTerm = filters.searchTerm;
    }
    
    onFilterChange(newFilters);
  };
  
  //filter reset
  const resetFilters = () => {
    setCategory('');
    setStoreId(undefined);
    setMinPrice('');
    setMaxPrice('');
    setZipCode('');
    
    //refresh - delete everything but search term 
    const newFilters: ProductFilters = {};
    if (filters.searchTerm) {
      newFilters.searchTerm = filters.searchTerm;
    }
    
    onFilterChange(newFilters);
  };
  
  //our chosen categories
  const categories = [
    'Dairy',
    'Produce',
    'Meat',
    'Bakery',
    'Dry',
    'Beverages'
  ];
  
  return (
    <div className="product-filter">
      <h2>Filter Products</h2>
      
      <div className="filter-section">
        <h3>Category</h3>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-section">
        <h3>Store</h3>
        <select 
          value={storeId || ''} 
          onChange={(e) => setStoreId(e.target.value ? Number(e.target.value) : undefined)}
          className="filter-select"
        >
          <option value="">All Stores</option>
          {stores.map((store) => (
            <option key={store.store_id} value={store.store_id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-section">
        <h3>Price Range</h3>
        <div className="price-range-inputs">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="price-input"
          />
          <span>to</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="price-input"
          />
        </div>
      </div>
      
      <div className="filter-section">
        <h3>Location</h3>
        <input
          type="text"
          placeholder="ZIP Code"
          pattern="[0-9]{5}"
          title="Please enter a valid 5-digit ZIP code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className="zip-code-input"
        />
      </div>
      
      <div className="filter-actions">
        <button onClick={applyFilters} className="apply-filters-btn">
          Apply Filters
        </button>
        <button onClick={resetFilters} className="reset-filters-btn">
          Reset All
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;