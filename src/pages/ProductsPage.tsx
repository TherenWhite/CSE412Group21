import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productApi, storeApi } from '../api';
import { Product, ProductFilters, Store } from '../types';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const newFilters: ProductFilters = {};
    
    if (searchParams.has('search')) {
      newFilters.searchTerm = searchParams.get('search') || undefined;
    }
    
    if (searchParams.has('category')) {
      newFilters.category = searchParams.get('category') || undefined;
    }
    
    if (searchParams.has('store')) {
      // [BASIC] uses dummy id right now
      const storeName = searchParams.get('store');
      if (storeName === 'Target') newFilters.storeId = 1;
      else if (storeName === 'Frys') newFilters.storeId = 2;
      else if (storeName === 'Amazon') newFilters.storeId = 3;
    }
    
    if (searchParams.has('zip_code')) {
      newFilters.zipCode = searchParams.get('zip_code') || undefined;
    }
    
    if (searchParams.has('min_price')) {
      newFilters.minPrice = Number(searchParams.get('min_price')) || undefined;
    }
    
    if (searchParams.has('max_price')) {
      newFilters.maxPrice = Number(searchParams.get('max_price')) || undefined;
    }
    
    setFilters(newFilters);
  }, [location.search]);
  
  //fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await storeApi.getAllStores();
        setStores(response.data);
      } catch (err) {
        console.error('Failed to fetch stores:', err);
        
        //MOCK DATA for frontend
        setStores([
          {
            store_id: 1,
            name: 'Target',
            zip_code: '85281',
            api_data: 'https://www.target.com/c/grocery/-/N-5xt1a',
            last_sync: new Date()
          },
          {
            store_id: 2,
            name: 'Frys',
            zip_code: '85281',
            api_data: 'https://www.frysfood.com',
            last_sync: new Date()
          },
          {
            store_id: 3,
            name: 'Amazon',
            zip_code: '0',
            api_data: 'https://www.amazon.com/fmc/storefront',
            last_sync: new Date()
          }
        ]);
      }
    };
    
    fetchStores();
  }, []);
  
  //fetch product upon field change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await productApi.getAllProducts(filters);
        setProducts(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
        console.error(err);
        
        //MOCK DATA (for frontend)
        setProducts([
          {
            product_id: 101,
            name: 'Whole Milk',
            description: 'Fresh whole milk, 1 gallon',
            category: 'Dairy',
            store_id: 1,
            current_price: 4.29,
            image_url: '/placeholder-milk.jpg'
          },
          {
            product_id: 102,
            name: 'Eggs',
            description: 'Large eggs, dozen',
            category: 'Dairy',
            store_id: 1,
            current_price: 6.59,
            image_url: '/placeholder-eggs.jpg'
          },
          {
            product_id: 103,
            name: 'White Bread',
            description: 'Sliced white bread',
            category: 'Bakery',
            store_id: 1,
            current_price: 3.89,
            image_url: '/placeholder-bread.jpg'
          },
          {
            product_id: 104,
            name: 'Bananas',
            description: 'Fresh bananas, per lb',
            category: 'Produce',
            store_id: 1,
            current_price: 0.79,
            image_url: '/placeholder-bananas.jpg'
          },
          {
            product_id: 105,
            name: 'Chicken Breast',
            description: 'Boneless skinless chicken breast, per lb',
            category: 'Meat',
            store_id: 1,
            current_price: 10.45,
            image_url: '/placeholder-chicken.jpg'
          },
          {
            product_id: 106,
            name: 'Ground Beef',
            description: 'Lean ground beef, per lb',
            category: 'Meat',
            store_id: 1,
            current_price: 8.49,
            image_url: '/placeholder-beef.jpg'
          },
          {
            product_id: 107,
            name: 'Potatoes',
            description: 'Russet potatoes, 5 lb bag',
            category: 'Produce',
            store_id: 2,
            current_price: 3.99,
            image_url: '/placeholder-potatoes.jpg'
          },
          {
            product_id: 108,
            name: 'Cheddar Cheese',
            description: 'Sharp cheddar cheese, 8 oz',
            category: 'Dairy',
            store_id: 2,
            current_price: 3.49,
            image_url: '/placeholder-cheese.jpg'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters]);
  


  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters({ ...filters, ...newFilters });
    
    //[BASIC] Update URL params (no routing library)
    const searchParams = new URLSearchParams();
    
    if (newFilters.searchTerm) {
      searchParams.set('search', newFilters.searchTerm);
    }
    
    if (newFilters.category) {
      searchParams.set('category', newFilters.category);
    }
    
    if (newFilters.storeId) {
      //[BASIC] convert store id to name
      let storeName = '';
      if (newFilters.storeId === 1) storeName = 'Target';
      else if (newFilters.storeId === 2) storeName = 'Frys';
      else if (newFilters.storeId === 3) storeName = 'Amazon';
      
      if (storeName) {
        searchParams.set('store', storeName);
      }
    }
    
    if (newFilters.zipCode) {
      searchParams.set('zip_code', newFilters.zipCode);
    }
    
    if (newFilters.minPrice) {
      searchParams.set('min_price', newFilters.minPrice.toString());
    }
    
    if (newFilters.maxPrice) {
      searchParams.set('max_price', newFilters.maxPrice.toString());
    }
    //update url
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${searchParams.toString()}`
    );
  };
  

  //get the page title from the filters
  const getPageTitle = (): string => {
    if (filters.searchTerm) {
      return `Search results for "${filters.searchTerm}"`;
    } else if (filters.category) {
      return `${filters.category} Products`;
    } else if (filters.storeId) {
      //id -> store name
      const store = stores.find(s => s.store_id === filters.storeId);
      return store ? `Products at ${store.name}` : 'All Products';
    } else {
      return 'All Products';
    }
  };
  return (
    <div className="products-page">
      <div className="products-header">
        <h1>{getPageTitle()}</h1>
        {filters.zipCode && (
          <p className="location-info">
            Results for ZIP code: {filters.zipCode}
          </p>
        )}
      </div>
      
      <div className="products-container">
        <aside className="filter-sidebar">
          <ProductFilter 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            stores={stores}
          />
        </aside>
        
        <div className="products-main">
          {loading ? (
            <div className="loading-container">
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>Error: {error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-results">
              <p>No products found!</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;