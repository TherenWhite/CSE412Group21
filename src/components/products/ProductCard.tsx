import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import './ProductCard.css';
import { useAuth } from '../../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { authState } = useAuth();
  const { isAuthenticated } = authState;
  
  //price format
  const formatPrice = (price: number | string): string => {
    //make sure price is number
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${!isNaN(numPrice) ? numPrice.toFixed(2) : '0.00'}`;
  };
  
  //get store name [BASIC]
  const getStoreName = (storeId: number): string => {
    const storeNames: Record<number, string> = {
      1: 'Target',
      2: 'Frys',
      3: 'Amazon'
    };
    
    return storeNames[storeId] || 'Unknown Store';
  };
  
  return (
    <div className="product-card">
      <Link to={`/products/${product.product_id}`} className="product-link">
        <div className="product-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="placeholder-image">
              {product.name.charAt(0)}
            </div>
          )}
          <div className="store-badge">{getStoreName(product.store_id)}</div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{formatPrice(product.current_price)}</p>
          <p className="product-category">{product.category}</p>
        </div>
      </Link>
      
      <div className="product-actions">
        <Link to={`/products/${product.product_id}`} className="view-details-btn">
          View Details
        </Link>
        
        {isAuthenticated && (
          <button className="add-to-list-btn">
            Add to List
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;