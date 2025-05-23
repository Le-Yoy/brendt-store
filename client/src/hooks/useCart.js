// src/hooks/useCart.js
'use client';

import { useContext, useEffect, useState } from 'react';
import CartContext from '../contexts/CartContext';

const CART_STORAGE_KEY = 'brendt-cart';

export default function useCart() {
 const context = useContext(CartContext);
 const [isClient, setIsClient] = useState(false);
 const [isCartReady, setIsCartReady] = useState(false);
 
 // Set isClient flag for safe client-side operations
 useEffect(() => {
   setIsClient(true);
 }, []);
 
 // Set a flag when cart is fully initialized and ready
 useEffect(() => {
   if (context && context.initialized) {
     setIsCartReady(true);
   }
 }, [context, context?.initialized]);
 
 // If no context or we're in middle of initialization, provide fallback
 if (!context || !context.state || !context.dispatch || !context.initialized) {
   if (isClient) {
     console.warn('[CART] useCart called without CartProvider or before initialization');
   }
   
   // Create fallback implementation using localStorage if possible
   let fallbackItems = [];
   let fallbackTotal = 0;
   
   if (isClient && typeof window !== 'undefined') {
     try {
       const savedCart = localStorage.getItem(CART_STORAGE_KEY);
       if (savedCart) {
         const parsedCart = JSON.parse(savedCart);
         fallbackItems = parsedCart.items || [];
         fallbackTotal = parsedCart.total || 0;
       }
     } catch (error) {
       console.error('[CART] Error loading fallback cart:', error);
       // Silent fail in case localStorage is not available
     }
   }
   
   // Return a default implementation to prevent crashes
   return {
     items: fallbackItems,
     total: fallbackTotal,
     itemCount: fallbackItems.reduce((count, item) => count + (parseInt(item.quantity, 10) || 0), 0),
     isCartOpen: false,
     isCartReady: false,
     initialized: false,
     setCartOpen: () => {
       console.warn('[CART] Cannot set cart open - CartProvider not available');
     },
     addItem: () => {
       console.warn('[CART] Cannot add item - CartProvider not available');
       return false;
     },
     removeItem: () => {
       console.warn('[CART] Cannot remove item - CartProvider not available');
       return false;
     },
     updateQuantity: () => {
       console.warn('[CART] Cannot update quantity - CartProvider not available');
       return false;
     },
     clearCart: () => {
       console.warn('[CART] Cannot clear cart - CartProvider not available');
       return false;
     },
     createCartBackup: () => {
       console.warn('[CART] Cannot create backup - CartProvider not available');
       return false;
     },
     restoreCartBackup: () => {
       console.warn('[CART] Cannot restore backup - CartProvider not available');
       return false;
     },
     formatPrice: (price) => {
       return new Intl.NumberFormat('fr-FR', {
         style: 'currency',
         currency: 'MAD',
         minimumFractionDigits: 0
       }).format(price || 0);
     }
   };
 }
 
 const { state, dispatch, initialized, createCartBackup, restoreCartBackup } = context;
 const { items, total, isCartOpen } = state;

 const getItemCount = () => {
   if (!Array.isArray(items)) return 0;
   return items.reduce((count, item) => count + (parseInt(item.quantity, 10) || 0), 0);
 };

 const formatPrice = (price) => {
   return new Intl.NumberFormat('fr-FR', {
     style: 'currency',
     currency: 'MAD',
     minimumFractionDigits: 0
   }).format(price || 0);
 };

 const setCartOpen = (isOpen) => {
   dispatch({
     type: 'SET_CART_OPEN',
     payload: isOpen
   });
 };

 const addItem = (product, selectedSize, selectedColor, quantity = 1, appendQuantity = false) => {
   if (!product || !selectedSize || !selectedColor) {
     console.error('[CART] Cannot add to cart: Missing product, size, or color');
     return false;
   }

   try {
     // Create backup before making changes
     if (typeof createCartBackup === 'function') {
       createCartBackup();
     }

     const colorImage = selectedColor.images && selectedColor.images.length > 0 
       ? selectedColor.images[0] 
       : null;

     // Ensure quantity is a valid number
     const parsedQuantity = parseInt(quantity, 10) || 1;

     const newItem = {
       productId: product._id || product.id,
       name: product.name,
       price: product.price,
       image: colorImage,
       quantity: parsedQuantity,
       size: selectedSize.eu || selectedSize.name,
       sizeName: selectedSize.name,
       color: selectedColor.name,
       colorCode: selectedColor.code,
       appendQuantity: appendQuantity
     };

     dispatch({
       type: 'ADD_ITEM',
       payload: newItem
     });
     
     // Force cart save to storage immediately
     try {
       if (typeof window !== 'undefined') {
         const currentCart = {
           items: [...(state.items || []), newItem],
           total: calculateTotal([...state.items, newItem])
         };
         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
       }
     } catch (storageError) {
       console.error('[CART] Failed to immediately save cart after add:', storageError);
     }
     
     return true;
   } catch (error) {
     console.error('[CART] Error adding item to cart:', error);
     return false;
   }
 };

 // Helper function to calculate total
 const calculateTotal = (items) => {
   if (!Array.isArray(items)) return 0;
   return items.reduce((sum, item) => {
     const price = parseFloat(item.price) || 0;
     const quantity = parseInt(item.quantity, 10) || 0;
     return sum + (price * quantity);
   }, 0);
 };

 const removeItem = (productId, size, color) => {
   try {
     if (!productId) {
       console.error('[CART] Cannot remove item: Missing product ID');
       return false;
     }

     // Create backup before making changes
     if (typeof createCartBackup === 'function') {
       createCartBackup();
     }

     dispatch({
       type: 'REMOVE_ITEM',
       payload: { productId, size, color }
     });
     
     // Force cart save to storage immediately after removal
     try {
       if (typeof window !== 'undefined' && Array.isArray(state.items)) {
         const filteredItems = state.items.filter(
           item => !(
             item.productId === productId && 
             item.size === size && 
             item.color === color
           )
         );
         const currentCart = {
           items: filteredItems,
           total: calculateTotal(filteredItems)
         };
         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
       }
     } catch (storageError) {
       console.error('[CART] Failed to immediately save cart after remove:', storageError);
     }
     
     return true;
   } catch (error) {
     console.error('[CART] Error removing item from cart:', error);
     return false;
   }
 };

 const updateQuantity = (productId, size, color, quantity) => {
   try {
     if (!productId) {
       console.error('[CART] Cannot update quantity: Missing product ID');
       return false;
     }

     if (quantity < 1) {
       console.error('[CART] Invalid quantity value:', quantity);
       return false;
     }
     
     // Create backup before making changes
     if (typeof createCartBackup === 'function') {
       createCartBackup();
     }
     
     const parsedQuantity = parseInt(quantity, 10);
     
     dispatch({
       type: 'UPDATE_QUANTITY',
       payload: { productId, size, color, quantity: parsedQuantity }
     });
     
     // Force cart save to storage immediately
     try {
       if (typeof window !== 'undefined' && Array.isArray(state.items)) {
         const updatedItems = state.items.map(item => {
           if (
             item.productId === productId && 
             item.size === size && 
             item.color === color
           ) {
             return {
               ...item,
               quantity: parsedQuantity
             };
           }
           return item;
         });
         
         const currentCart = {
           items: updatedItems,
           total: calculateTotal(updatedItems)
         };
         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(currentCart));
       }
     } catch (storageError) {
       console.error('[CART] Failed to immediately save cart after update:', storageError);
     }
     
     return true;
   } catch (error) {
     console.error('[CART] Error updating item quantity:', error);
     return false;
   }
 };

 const clearCart = () => {
   try {
     // Create backup before making changes
     if (typeof createCartBackup === 'function') {
       createCartBackup();
     }
     
     dispatch({ type: 'CLEAR_CART' });
     
     // Force cart save to storage immediately
     try {
       if (typeof window !== 'undefined') {
         const emptyCart = {
           items: [],
           total: 0
         };
         localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(emptyCart));
       }
     } catch (storageError) {
       console.error('[CART] Failed to immediately save cart after clear:', storageError);
     }
     
     return true;
   } catch (error) {
     console.error('[CART] Error clearing cart:', error);
     return false;
   }
 };

 return {
   items,
   total,
   itemCount: getItemCount(),
   isCartOpen,
   isCartReady,
   initialized,
   setCartOpen,
   addItem,
   removeItem,
   updateQuantity,
   clearCart,
   createCartBackup,
   restoreCartBackup,
   formatPrice
 };
}