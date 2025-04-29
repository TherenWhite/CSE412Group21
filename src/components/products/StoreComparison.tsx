import React from 'react';
import './StoreComparison.css';

interface StoreComparisonProps {
  productId: number;
}

const StoreComparison: React.FC<StoreComparisonProps> = ({ productId }) => {
  // [BASIC] would need to actually fetch this from api
  const storeComparisons = [
    { id: 1, name: 'Target', price: 4.29, inStock: true },
    { id: 2, name: 'Frys', price: 4.49, inStock: true },
    { id: 3, name: 'Amazon', price: 5.99, inStock: false }
  ];
  
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };
  
  return (
    <div className="store-comparison">
      <div className="store-comparison-table">
        <table>
          <thead>
            <tr>
              <th>Store</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeComparisons.map((store) => (
              <tr key={store.id} className={store.id === 1 ? 'best-price' : ''}>
                <td>{store.name}</td>
                <td>{formatPrice(store.price)}</td>
                <td>
                  {store.inStock ? (
                    <span className="in-stock">In Stock</span>
                  ) : (
                    <span className="out-of-stock">Out of Stock</span>
                  )}
                </td>
                <td>
                  <button 
                    className="view-store-btn"
                    disabled={!store.inStock}
                  >
                    View at {store.name}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="price-difference-note">
        <p>Save up to $1.70 by shopping at Target instead of Amazon</p>
      </div>
    </div>
  );
};

export default StoreComparison;