import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductFilter from '../components/products/ProductFilter';
import ProductDetailPage from '../pages/ProductDetailPage';
import { ProductFilters, Store } from '../types';
import { storeApi } from '../api';

// Container for product list + filters
const ProductsPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    storeApi.getAllStores()
      .then(res => setStores(res.data))
      .catch(console.error);
  }, []);

  return (
    <ProductFilter
      filters={filters}
      onFilterChange={setFilters}
      stores={stores}
    />
  );
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/products" element={<ProductsPage />} />
    <Route path="/products/:productId" element={<ProductDetailPage />} />
  </Routes>
);

export default AppRoutes;
