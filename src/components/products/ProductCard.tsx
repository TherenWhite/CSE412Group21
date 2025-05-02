import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, ShoppingListItem, ShoppingList } from '../../types';
import './ProductCard.css';
import { useAuth } from '../../contexts/AuthContext';
import { shoppingListApi } from '../../api';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { authState } = useAuth();
  const { isAuthenticated, user, loading: authLoading } = authState;

  const [quantity, setQuantity] = useState<number>(0);

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
  
  // when this card mounts or auth completes, fetch the user’s list so we can display current qty  
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setQuantity(0);
      return;
    }

    (async () => {
      try {
        console.log('Fetching list for user', user.user_id);
        const res = await shoppingListApi.getUserLists(user.user_id);
        if (!res.data.length) {
          setQuantity(0);
          return;
        }
        const listId = res.data[0].list_id;
        const full = await shoppingListApi.getListById(listId);
        const items: ShoppingListItem[] = full.data.items ?? [];
        const item = items.find(
          (it: ShoppingListItem) => it.product.product_id === product.product_id
        );
        setQuantity(item?.quantity ?? 0);
      } catch (err) {
        console.error('Error fetching shopping list:', err);
      }
    })();
  }, [product.product_id, user, authLoading]);
  
  // unified handler for changing quantity
  const handleChange = async (delta: number) => {
    if (!user) return; 
    try {
      console.log('handleChange delta', delta);
      const lists = await shoppingListApi.getUserLists(user.user_id);
      let listId: number;
      if (lists.data.length === 0) {
        console.log('No list, creating new');
        const newList = await shoppingListApi.createList({
          user_id: user.user_id,
          list_name: 'My List',
          total: 0,
          applied_coupons: '' //
        });
        listId = newList.data.list_id;
      } else {
        listId = lists.data[0].list_id;
      }
      const full = await shoppingListApi.getListById(listId);
      const items: ShoppingListItem[] = full.data.items ?? [];
      const existing = items.find(
        (it: ShoppingListItem) => it.product.product_id === product.product_id
      );
      const currentQty = existing?.quantity ?? 0;
      const newQty = Math.max(0, currentQty + delta);

      // remove item if qty goes to zero
      const updatedItems = newQty > 0
        ? (
            existing
              ? items.map(it =>
                  it.product.product_id === product.product_id
                    ? { ...it, quantity: newQty }
                    : it
                )
              : [...items, { product, quantity: newQty }]
          )
        : items.filter(it => it.product.product_id !== product.product_id);

      // update total accordingly
      const priceNum = typeof product.current_price === 'number'
        ? product.current_price
        : parseFloat(product.current_price);
      const totalDelta = delta * priceNum;
      console.log('Updating list', listId, 'items', updatedItems, 'totalDelta', totalDelta);
      await shoppingListApi.updateList(listId, {
        items: updatedItems,
        total: full.data.total + totalDelta
      });

      setQuantity(newQty);
    } catch (err) {
      console.error('Error updating shopping list:', err);
    }
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
          quantity > 0 ? (
            <div className="quantity-controls">    {/*<- show +/- when qty>0 */}
              <button onClick={() => handleChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleChange(1)}>+</button>
            </div>
          ) : (
            <button onClick={() => handleChange(1)} className="add-to-list-btn">
              Add to List  {/*<- only show when qty=0 */}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ProductCard;
