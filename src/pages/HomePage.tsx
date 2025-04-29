import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi, storeApi } from '../api';
import { Product, Store } from '../types';
import ProductCard from '../components/products/ProductCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    //loading featured items
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsResponse = await productApi.getAllProducts();
        //products for  featured
        setFeaturedProducts(productsResponse.data.slice(0, 6));
        
        const storesResponse = await storeApi.getAllStores();
        setStores(storesResponse.data);
        
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        console.error(err);
        //MOCK DATA for frontend only
        //----------------------------------------------------------------------------------------
        setFeaturedProducts([
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
          }
        ]);
        //----------------------------------------------------------------------------------------
        
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
  };
  
  const handleZipCodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?zip_code=${encodeURIComponent(zipCode)}`);
  };
  
  //homepage categories
  const categories = [
    { name: 'Dairy', icon: '🥛' },
    { name: 'Produce', icon: '🍎' },
    { name: 'Meat', icon: '🥩' },
    { name: 'Bakery', icon: '🍞' },
    { name: 'Dry Goods', icon: '🥫' },
    { name: 'Beverages', icon: '🥤' }
  ];
  
  return (
    <div className="home-page">
      {/* hero section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Group 21's Local Grocery Price Tracker</h1>
          <p>Compare prices from different stores to maximize your savings!</p>
          
          <form className="hero-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search store products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-button">
              Search
            </button>
          </form>
          
          <div className="store-selection">
            <p>Find deals in your area:</p>
            <form className="zip-code-form" onSubmit={handleZipCodeSearch}>
              <input
                type="text"
                placeholder="Enter zip code"
                pattern="[0-9]{5}"
                title="zipcode invalid"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="zip-code-input"
              />
              <button type="submit" className="zip-code-button">
                Find Stores
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* categories section */}
      <section className="categories-section">
        <h2>Categories</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              key={category.name}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>
      
      {/* featured  section */}
      <section className="featured-section">
        <h2>Featured Deals</h2>
        {loading ? (
          <div className="loading-container">
            <p>Loading featured products...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
        <div className="view-all-container">
          <Link to="/products" className="view-all-button">
            View All Products
          </Link>
        </div>
      </section>
      
      {/* stores section */}
      <section className="stores-section">
        <h2>Products From...</h2>
        <div className="stores-grid">
          {stores.map((store) => (
            <Link
              to={`/products?store=${encodeURIComponent(store.name)}`}
              className="store-card"
              key={store.store_id}
            >
              <h3>{store.name}</h3>
              <p>Deals from {store.name}</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* 'how it works' section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">🔍</div>
            <h3>Search and Compare</h3>
            <p>Search for items and compare prices from multiple stores in your area</p>
          </div>
          <div className="step">
            <div className="step-icon">📊</div>
            <h3>Track Prices</h3>
            <p>View price history and see when prices are at their lowest</p>
          </div>
          <div className="step">
            <div className="step-icon">💰</div>
            <h3>Save Money</h3>
            <p>Find the best deals and make optimal shopping lists</p>
          </div>
        </div>
      </section>
      
      {/* create account section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Unlock more features?</h2>
          <p>Create an account to save your favorite products, get price alerts, and manage your shopping lists.</p>
          <Link to="/register" className="cta-button">
            Sign Up
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;