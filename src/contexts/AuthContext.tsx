import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api';
import { User, LoginCredentials, RegisterData, AuthState } from '../types';

//contxt interface
interface AuthContextProps {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}
const AuthContext = createContext<AuthContextProps>({
  authState: {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  },
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {}
});

//custom hook
export const useAuth = () => useContext(AuthContext);

//auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  //upon mounting, check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        });
        return;
      }
      
      try {
        //fetch user data
        const response = await authApi.getCurrentUser();
        
        const u = response.data;
        u.budget = parseFloat(u.budget as unknown as string);
        
        setAuthState({
          isAuthenticated: true,
          user: response.data,
          loading: false,
          error: null
        });
      } catch (error) {
        //handle token fail
        localStorage.removeItem('token');
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'session expired'
        });
      }
    };

    checkAuth();
  }, []);


  //login function
  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authApi.login(credentials);
      
      //save token (localStorage)
      localStorage.setItem('token', response.data.token);
      
      const u = response.data;
      u.user.budget = parseFloat(u.user.budget as unknown as string);

      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
        error: null
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Login failed, try again!'
      }));
      throw error;
    }
  };

  //register function
  const register = async (data: RegisterData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authApi.register(data);
      //save token (localStorage)
      localStorage.setItem('token', response.data.token);
      
      const u = response.data;
      u.user.budget = parseFloat(u.user.budget as unknown as string);

      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
        error: null
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Registration failed, try again!'
      }));
      throw error;
    }
  };

  //logout function
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  //update profile function
  const updateProfile = async (userData: Partial<User>) => {
    if (!authState.user) {
      throw new Error('User not authenticated');
    }
    
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authApi.updateProfile(authState.user.user_id, userData);
      
      const u = response.data;
      u.budget = parseFloat(u.budget as unknown as string);

      setAuthState(prev => ({
        ...prev,
        user: response.data,
        loading: false,
        error: null
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to update profile. Please try again.'
      }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;