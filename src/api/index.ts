//grocery-price-tracker/src/api/index.ts
import axios from 'axios';
import { 
  Product, 
  Store, 
  User, 
  ShoppingList, 
  PriceHistory, 
  Coupon, 
  ProductPreference,
  ProductFilters,
  LoginCredentials,
  RegisterData,
  ApiResponse
} from '../types';

const API_BASE_URL = 'http://localhost:5000/api'; //TODO: change this our actual api base url

//axios interface with base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    //TODO: Update endpoint and response handling once backend is implemented
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    //TODO: Update endpoint and response handling once backend is implemented
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updateProfile: async (userId: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

//product API
export const productApi = {
  getAllProducts: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    //TODO: Update endpoint and query params once backend is implemented
    const response = await api.get('/products', { params: filters });
    return response.data;
  },
  
  getProductById: async (productId: number): Promise<ApiResponse<Product>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
  
  getProductsByStore: async (storeId: number): Promise<ApiResponse<Product[]>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get(`/products/store/${storeId}`);
    return response.data;
  },
  
  getProductsByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get('/products', { params: { category } });
    return response.data;
  },
  
  getPriceHistory: async (productId: number): Promise<ApiResponse<PriceHistory[]>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get(`/products/${productId}/price-history`);
    return response.data;
  },
};

//store API
export const storeApi = {
  getAllStores: async (): Promise<ApiResponse<Store[]>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get('/stores');
    return response.data;
  },
  
  getStoreById: async (storeId: number): Promise<ApiResponse<Store>> => {
    // TODO: Update endpoint once backend is implemented
    const response = await api.get(`/stores/${storeId}`);
    return response.data;
  },
  
  getStoresByZipCode: async (zipCode: string): Promise<ApiResponse<Store[]>> => {
    // TODO: Update endpoint once backend is implemented
    const response = await api.get('/stores', { params: { zip_code: zipCode } });
    return response.data;
  },
};

//shopping list API
export const shoppingListApi = {
  getUserLists: async (userId: number): Promise<ApiResponse<ShoppingList[]>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get('/shopping-lists');
    return response.data;
  },
  
  getListById: async (listId: number): Promise<ApiResponse<ShoppingList>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get(`/shopping-lists/${listId}`);
    return response.data;
  },
  

  createList: async (list: Omit<ShoppingList, 'list_id'>): Promise<ApiResponse<ShoppingList>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.post('/shopping-lists', list);
    return response.data;
  },
  
  updateList: async (listId: number, list: Partial<ShoppingList>): Promise<ApiResponse<ShoppingList>> => {
    //TODO: Update endpoint once backend is implemented

    const response = await api.put(`/shopping-lists/${listId}`, list);
    return response.data;
  },
  
  deleteList: async (listId: number): Promise<ApiResponse<{ success: boolean }>> => {
    // TODO: Update endpoint once backend is implemented
    const response = await api.delete(`/shopping-lists/${listId}`);
    return response.data;
  },
};

//preference API
export const preferenceApi = {
  getUserPreferences: async (userId: number): Promise<ApiResponse<ProductPreference[]>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get('/preferences');
    return response.data;
  },
  
  createPreference: async (preference: Omit<ProductPreference, 'pref_id'>): Promise<ApiResponse<ProductPreference>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.post('/preferences', preference);
    return response.data;
  },
  
  updatePreference: async (prefId: number, preference: Partial<ProductPreference>): Promise<ApiResponse<ProductPreference>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.put(`/preferences/${prefId}`, preference);
    return response.data;
  },
  
  deletePreference: async (prefId: number): Promise<ApiResponse<{ success: boolean }>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.delete(`/preferences/${prefId}`);
    return response.data;
  },
};

//coupon API
export const couponApi = {
  getProductCoupons: async (productId: number): Promise<ApiResponse<Coupon[]>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get(`/coupons/product/${productId}`);
    return response.data;
  },
  
  getStoreCoupons: async (storeId: number): Promise<ApiResponse<Coupon[]>> => {
    //TODO: Update endpoint once backend is implemented
    const response = await api.get(`/coupons/store/${storeId}`);
    return response.data;
  },
};

export default {
  auth: authApi,
  products: productApi,
  stores: storeApi,
  shoppingLists: shoppingListApi,
  preferences: preferenceApi,
  coupons: couponApi
};