//store entity
export interface Store {
    store_id: number;
    name: string;
    zip_code: string;
    api_data: string;
    last_sync: Date;
  }

  //product entity
  export interface Product {
    product_id: number;
    name: string;
    description: string;
    category: string;
    store_id: number;
    current_price: number;
    image_url: string;
  }
  
  //user entity
  export interface User {
    user_id: number;
    email: string;
    password: string; //RIGHT NOW PASSWORD IS EXPOSED TO FRONTEND 
    zip_code: string;
    budget: number;
  }

  export interface ShoppingListItem{
    product: Product;
    quantity: number;
  }
  
  //shopping list entity
  export interface ShoppingList {
    list_id: number;
    user_id: number;
    list_name: string;
    total: number;
    applied_coupons: string | null;
    items?: ShoppingListItem[];
  }
  
  //product preference entity
  export interface ProductPreference {
    pref_id: number;
    user_id: number;
    product_id: number;
    price_threshold: number;
    notify_if_on_sale: boolean;
  }
  
  //prict history entity
  export interface PriceHistory {
    history_id: number;
    product_id: number;
    price: number;
    time_stamp: Date;
  }
  
  //coupon entity
  export interface Coupon {
    coupon_id: number;
    product_id: number;
    store_loc: string;
    discount: number;
    expiration_date: Date;
  }
  
  //api response
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }
  
  // search filters
  export interface ProductFilters {
    searchTerm?: string;
    category?: string;
    storeId?: number;
    minPrice?: number;
    maxPrice?: number;
    zipCode?: string;
  }
  
  // user auth interfaces
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    zip_code: string;
    budget: number;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
  }