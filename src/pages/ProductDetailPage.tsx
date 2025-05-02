import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi, couponApi } from '../api';
import { Product, PriceHistory, Coupon } from '../types';
import PriceChart from '../components/products/PriceChart';
import StoreComparison from '../components/products/StoreComparison';
import { useAuth } from '../contexts/AuthContext';
import './ProductDetailPage.css';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { authState } = useAuth();
  const { isAuthenticated } = authState;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        //get details
        const productResponse = await productApi.getProductById(Number(productId));
        setProduct(productResponse.data);
        
        //get price history
        const historyResponse = await productApi.getPriceHistory(Number(productId));
        // convert any string prices to numbers  //<- added
        setPriceHistory(historyResponse.data.map(h => ({ ...h, price: typeof h.price === 'string' ? parseFloat(h.price) : h.price }))); //<- added
        
        //get coupons
        const couponsResponse = await couponApi.getProductCoupons(Number(productId));
        setCoupons(couponsResponse.data);
        
        //similar products?
        const similarResponse = await productApi.getProductsByCategory(productResponse.data.category);
        setSimilarProducts(
          similarResponse.data
            .filter(p => p.product_id !== Number(productId))
            .slice(0, 4)
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load product data');
        console.error(err);
        
        //MOCK DATA (for frontend)
        const mockProduct: Product = {
          product_id: 101,
          name: 'Whole Milk',
          description: 'Fresh whole milk, 1 gallon. Farm-raised cows with no added hormones.',
          category: 'Dairy',
          store_id: 1,
          current_price: 4.29,
          image_url: '/placeholder-milk.jpg'
        };
        
        setProduct(mockProduct);
        
        const mockPriceHistory: PriceHistory[] = [
          { history_id: 1, product_id: 101, price: 4.49, time_stamp: new Date('2025-03-01') },
          { history_id: 2, product_id: 101, price: 4.39, time_stamp: new Date('2025-03-10') },
          { history_id: 3, product_id: 101, price: 4.29, time_stamp: new Date('2025-03-20') }
        ];
        
        setPriceHistory(mockPriceHistory);
        
        const mockCoupons: Coupon[] = [
          { 
            coupon_id: 1, 
            product_id: 101, 
            store_loc: '85281', 
            discount: 0.50, 
            expiration_date: new Date('2025-04-15') 
          }
        ];
        
        setCoupons(mockCoupons);
        
        const mockSimilarProducts: Product[] = [
          {
            product_id: 102,
            name: 'Fat-Free Milk',
            description: 'Fat-free milk, 1 gallon',
            category: 'Dairy',
            store_id: 1,
            current_price: 3.99,
            image_url: '/placeholder-fat-free-milk.jpg'
          },
          {
            product_id: 103,
            name: 'Almond Milk',
            description: 'Unsweetened almond milk, 64oz',
            category: 'Dairy',
            store_id: 2,
            current_price: 3.49,
            image_url: '/placeholder-almond-milk.jpg'
          },
          {
            product_id: 104,
            name: 'Heavy Cream',
            description: 'Heavy whipping cream, 16oz',
            category: 'Dairy',
            store_id: 1,
            current_price: 4.79,
            image_url: '/placeholder-cream.jpg'
          }
        ];
        
        setSimilarProducts(mockSimilarProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId]);
  
  //price format
  const formatPrice = (price: number | string): string => { //<- modified
    const num = typeof price === 'string' ? parseFloat(price) : price; //<- added
    return `$${num.toFixed(2)}`; //<- modified
  };
  
  //date format
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  //[BASIC] storename
  const getStoreName = (storeId: number): string => {
    const storeNames: Record<number, string> = {
      1: 'Target',
      2: 'Frys',
      3: 'Amazon'
    };
    
    return storeNames[storeId] || 'Unknown Store';
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="error-container">
        <p>Error: {error || 'Product not found'}</p>
        <Link to="/products" className="back-to-products">
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="product-detail-page">
      <div className="product-breadcrumb">
        <Link to="/products">Products</Link> &gt; 
        <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link> &gt; 
        <span>{product.name}</span>
      </div>
      
      <div className="product-main">
        <div className="product-image-container">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="product-image" />
          ) : (
            <div className="placeholder-image">
              {product.name.charAt(0)}
            </div>
          )}
          
          <div className="store-badge">{getStoreName(product.store_id)}</div>
        </div>
        
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          
          <div className="product-meta">
            <span className="product-category">{product.category}</span>
            <span className="product-store">
              Sold by: {getStoreName(product.store_id)}
            </span>
          </div>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-price-container">
            <span className="current-price">{formatPrice(product.current_price)}</span>
            
            {priceHistory.length > 0 && (
              <div className="price-trend">
                {priceHistory[0].price > product.current_price ? (
                  <span className="price-decreased">
                    Price decreased from {formatPrice(priceHistory[0].price)}
                  </span>
                ) : priceHistory[0].price < product.current_price ? (
                  <span className="price-increased">
                    Price increased from {formatPrice(priceHistory[0].price)}
                  </span>
                ) : (
                  <span className="price-unchanged">
                    Price unchanged in the last {priceHistory.length} updates
                  </span>
                )}
              </div>
            )}
          </div>
          
          {coupons.length > 0 && (
            <div className="product-coupons">
              <h3>Available Coupons</h3>
              <ul className="coupon-list">
                {coupons.map((coupon) => (
                  <li key={coupon.coupon_id} className="coupon-item">
                    <div className="coupon-discount">
                      Save {formatPrice(coupon.discount)}
                    </div>
                    <div className="coupon-details">
                      <span className="coupon-store">
                        Valid at {getStoreName(product.store_id)} store #{coupon.store_loc}
                      </span>
                      <span className="coupon-expiry">
                        Expires: {formatDate(coupon.expiration_date)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="product-actions">
            {isAuthenticated ? (
              <>
                <button className="add-to-list-btn">
                  Add to Shopping List
                </button>
                <button className="track-price-btn">
                  Track Price
                </button>
              </>
            ) : (
              <Link to="/login" className="login-to-track-btn">
                Login to Track Prices & Create Shopping Lists
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/*price hsitory chart */}
      {priceHistory.length > 0 && (
        <div className="price-history-section">
          <h2>Price History</h2>
          <PriceChart priceHistory={priceHistory} />
        </div>
      )}
      
      {/* store comparison */}
      <div className="store-comparison-section">
        <h2>Compare Prices Across Stores</h2>
        <StoreComparison productId={product.product_id} />
      </div>
      
      {/* similar products */}
      {similarProducts.length > 0 && (
        <div className="similar-products-section">
          <h2>Similar Products</h2>
          <div className="similar-products-grid">
            {similarProducts.map((similarProduct) => (
              <Link 
                key={similarProduct.product_id} 
                to={`/products/${similarProduct.product_id}`}
                className="similar-product-card"
              >
                <div className="similar-product-image">
                  {similarProduct.image_url ? (
                    <img src={similarProduct.image_url} alt={similarProduct.name} />
                  ) : (
                    <div className="placeholder-image">
                      {similarProduct.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="similar-product-info">
                  <h3>{similarProduct.name}</h3>
                  <p className="similar-product-store">
                    {getStoreName(similarProduct.store_id)}
                  </p>
                  <p className="similar-product-price">
                    {formatPrice(similarProduct.current_price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;