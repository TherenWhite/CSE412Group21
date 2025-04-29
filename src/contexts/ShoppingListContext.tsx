import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShoppingList } from '../types';
import { shoppingListApi } from '../api';
import { useAuth } from './AuthContext';

//define contxt interface
interface ShoppingListContextProps {
  lists: ShoppingList[];
  currentList: ShoppingList | null;
  loading: boolean;
  error: string | null;
  fetchLists: () => Promise<void>;
  setCurrentList: (list: ShoppingList | null) => void;
  createList: (list: Omit<ShoppingList, 'list_id'>) => Promise<void>;
  updateList: (listId: number, list: Partial<ShoppingList>) => Promise<void>;
  deleteList: (listId: number) => Promise<void>;
}
const ShoppingListContext = createContext<ShoppingListContextProps>({
  lists: [],
  currentList: null,
  loading: false,
  error: null,
  fetchLists: async () => {},
  setCurrentList: () => {},
  createList: async () => {},
  updateList: async () => {},
  deleteList: async () => {}
});

//custom hook for shopping list
export const useShoppingList = () => useContext(ShoppingListContext);

interface ShoppingListProviderProps {
  children: ReactNode;
}

export const ShoppingListProvider: React.FC<ShoppingListProviderProps> = ({ children }) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [currentList, setCurrentList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { authState } = useAuth();
  
  //fetch shopping lst after user logs in
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      fetchLists();
    } else {
      //reset if user logs out
      setLists([]);
      setCurrentList(null);
    }
  }, [authState.isAuthenticated, authState.user]);
  
  //fetch all the lists for current user
  const fetchLists = async () => {
    if (!authState.user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await shoppingListApi.getUserLists(authState.user.user_id);
      setLists(response.data);
      if (response.data.length > 0 && !currentList) {
        setCurrentList(response.data[0]);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch shopping lists');
    } finally {
      setLoading(false);
    }
  };
  
  //create new list
  const createList = async (list: Omit<ShoppingList, 'list_id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await shoppingListApi.createList(list);
      
      //add new list
      setLists(prevLists => [...prevLists, response.data]);
      
      //set a list to current list
      setCurrentList(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create shopping list');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  //update existing list
  const updateList = async (listId: number, list: Partial<ShoppingList>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await shoppingListApi.updateList(listId, list);
      
      setLists(prevLists => 
        prevLists.map(l => l.list_id === listId ? response.data : l)
      );
      if (currentList && currentList.list_id === listId) {
        setCurrentList(response.data);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update shopping list');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  //delete list function
  const deleteList = async (listId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await shoppingListApi.deleteList(listId);
      setLists(prevLists => prevLists.filter(l => l.list_id !== listId));
      
      if (currentList && currentList.list_id === listId) {
        const remainingLists = lists.filter(l => l.list_id !== listId);
        setCurrentList(remainingLists.length > 0 ? remainingLists[0] : null);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete shopping list');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{
        lists,
        currentList,
        loading,
        error,
        fetchLists,
        setCurrentList,
        createList,
        updateList,
        deleteList
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export default ShoppingListContext;