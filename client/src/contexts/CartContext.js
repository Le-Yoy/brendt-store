// src/contexts/CartContext.js
'use client';

import { createContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'brendt-cart';
const CART_BACKUP_KEY = 'brendt-cart-backup';

function calculateTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        i => i.productId === action.payload.productId && 
             i.size === action.payload.size && 
             i.color === action.payload.color
      );
    
      if (existingItemIndex > -1) {
        // Create a new array to avoid direct state mutation
        const newItems = [...state.items];
        
        // Ensure quantity is a number
        const newQuantity = parseInt(action.payload.quantity, 10) || 1;
        const currentQuantity = parseInt(newItems[existingItemIndex].quantity, 10) || 0;
        
        // If appendQuantity flag is set, add to existing quantity
        if (action.payload.appendQuantity) {
          newItems[existingItemIndex] = { 
            ...newItems[existingItemIndex], 
            quantity: currentQuantity + newQuantity
          };
        } else {
          // Otherwise replace the quantity
          newItems[existingItemIndex] = { 
            ...newItems[existingItemIndex], 
            quantity: newQuantity
          };
        }
        
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
          isCartOpen: true // Automatically open cart when item added
        };
      }
    
      // Ensure new item has valid quantity
      const newQuantity = parseInt(action.payload.quantity, 10) || 1;
      const newItem = { ...action.payload, quantity: newQuantity };
      const newItems = [...state.items, newItem];
      
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        isCartOpen: true // Automatically open cart when item added
      };
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(
        item => !(
          item.productId === action.payload.productId && 
          item.size === action.payload.size && 
          item.color === action.payload.color
        )
      );
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems)
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item => {
        if (
          item.productId === action.payload.productId && 
          item.size === action.payload.size && 
          item.color === action.payload.color
        ) {
          return {
            ...item,
            quantity: parseInt(action.payload.quantity, 10)
          };
        }
        return item;
      });
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: calculateTotal(action.payload.items || [])
      };

    case 'SET_CART_OPEN':
      return {
        ...state,
        isCartOpen: action.payload
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isCartOpen: false
  });
  
  const [initialized, setInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        
        if (savedCart) {
          console.log('[CART] Loading cart from localStorage');
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        }
        
        // Mark as initialized even if we don't load anything
        setInitialized(true);
      }
    } catch (error) {
      console.error('[CART] Failed to load cart from localStorage', error);
      setInitialized(true); // Still mark as initialized so we can continue
    }
  }, []);

  // Save cart to localStorage on changes - improved to avoid race conditions
  useEffect(() => {
    if (initialized && typeof window !== 'undefined') {
      try {
        console.log('[CART] Saving cart to localStorage', {
          itemCount: state.items.length,
          items: state.items
        });
        
        // Synchronously save cart data
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
          items: state.items,
          total: state.total
        }));
        
        // Also save to sessionStorage for cross-page navigation
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
          items: state.items,
          total: state.total
        }));
      } catch (error) {
        console.error('[CART] Failed to save cart to storage', error);
      }
    }
  }, [state.items, state.total, initialized]);
  
  // Create simple backup functions that work
  const createCartBackup = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_BACKUP_KEY, JSON.stringify({
          items: state.items,
          total: state.total
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('[CART] Failed to create backup:', error);
      return false;
    }
  };
  
  const restoreCartBackup = () => {
    try {
      if (typeof window !== 'undefined') {
        const backup = localStorage.getItem(CART_BACKUP_KEY);
        if (backup) {
          const parsedBackup = JSON.parse(backup);
          dispatch({ type: 'LOAD_CART', payload: parsedBackup });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('[CART] Failed to restore backup:', error);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      state, 
      dispatch, 
      initialized,
      createCartBackup,
      restoreCartBackup 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;