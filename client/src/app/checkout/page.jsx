'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useCart from '@/hooks/useCart';
import useAuth from '@/hooks/useAuth';
import styles from './Checkout.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import orderService from '@/services/orderService';
import addressService from '@/services/addressService';
import CartContext from '@/contexts/CartContext';
import { useContext } from 'react';

const CART_STORAGE_KEY = 'brendt-cart';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const cartContext = useContext(CartContext);
  
  const cart = useCart();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    email: '',
    address: '',
    postalCode: ''
  });
  
  // Added state for user addresses
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  
  // Phone number validation
  const [phoneError, setPhoneError] = useState('');
  
  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Stripe Checkout Session variables
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const searchParams = useSearchParams();

  // Calculate delivery date
  const [deliveryDate, setDeliveryDate] = useState('');
  
  // Check if cart is empty and try to restore from storage
  useEffect(() => {
    const checkAndRestoreCart = () => {
      if ((!cart.items || cart.items.length === 0) && typeof window !== 'undefined') {
        console.log('[CHECKOUT] Cart appears empty, trying to load from storage');
        
        // Try to restore from sessionStorage first (for cross-page navigation)
        try {
          const sessionCart = sessionStorage.getItem(CART_STORAGE_KEY);
          if (sessionCart) {
            const parsedCart = JSON.parse(sessionCart);
            if (parsedCart && Array.isArray(parsedCart.items) && parsedCart.items.length > 0) {
              console.log('[CHECKOUT] Found cart in sessionStorage, restoring', parsedCart.items);
              if (cartContext && cartContext.dispatch) {
                cartContext.dispatch({ type: 'LOAD_CART', payload: parsedCart });
              }
              return;
            }
          }
        } catch (error) {
          console.error('[CHECKOUT] Error restoring from sessionStorage:', error);
        }
        
        // Fall back to localStorage
        try {
          const localCart = localStorage.getItem(CART_STORAGE_KEY);
          if (localCart) {
            const parsedCart = JSON.parse(localCart);
            if (parsedCart && Array.isArray(parsedCart.items) && parsedCart.items.length > 0) {
              console.log('[CHECKOUT] Found cart in localStorage, restoring', parsedCart.items);
              if (cartContext && cartContext.dispatch) {
                cartContext.dispatch({ type: 'LOAD_CART', payload: parsedCart });
              }
            }
          }
        } catch (error) {
          console.error('[CHECKOUT] Error restoring from localStorage:', error);
        }
      }
    };
    
    // Run check after a short delay to ensure component is fully mounted
    const timer = setTimeout(checkAndRestoreCart, 200);
    return () => clearTimeout(timer);
  }, [cart.items, cartContext]);

  /**
   * Validates a phone number for Moroccan or international format
   * @param {string} phone - Phone number to validate
   * @returns {string|null} Error message or null if valid
   */
  const validatePhone = (phone) => {
    if (!phone) {
      return 'Le numéro de téléphone est requis';
    }
    
    // Clean phone number from spaces
    const cleanedPhone = phone.replace(/\s+/g, '');
    
    // Validate Moroccan or international phone numbers (your original validation)
    const moroccanPattern = /^(0[567][0-9]{8})$/;
    const internationalPattern = /^(\+|00)[1-9][0-9]{10,14}$/;
    
    if (!moroccanPattern.test(cleanedPhone) && !internationalPattern.test(cleanedPhone)) {
      return 'Veuillez entrer un numéro de téléphone valide (format marocain ou international)';
    }
    
    return null; // No error
  };

  // Calculate estimated delivery date when component mounts
  useEffect(() => {
    const today = new Date();
    const currentHour = today.getHours();
    
    // If order is placed before 3pm, deliver next day, otherwise in 2 days
    const deliveryDays = currentHour < 15 ? 1 : 2;
    
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + deliveryDays);
    
    // Format the date in French
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDeliveryDate(estimatedDate.toLocaleDateString('fr-FR', options));
  }, []);

  // Load user addresses and pre-fill form when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('[DEBUG][CHECKOUT] Loading user profile data for checkout...', user);
      
      // Pre-fill basic user information immediately
      setFormData(prevData => {
        console.log('[DEBUG][CHECKOUT] Setting form data from user profile');
        return {
          ...prevData,
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        };
      });
      
      // Fetch addresses separately with better error handling
      const fetchAddresses = async () => {
        try {
          console.log('[CHECKOUT] Fetching user addresses...');
          const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
          
          if (!token) {
            console.warn('[CHECKOUT] No auth token available, cannot fetch addresses');
            return;
          }
          
          console.log('[CHECKOUT] Auth token present, length:', token.length);
          
          // Get addresses using the service
          const addresses = await addressService.getUserAddresses();
          console.log('[CHECKOUT] Addresses loaded:', addresses);
          
          if (Array.isArray(addresses) && addresses.length > 0) {
            setUserAddresses(addresses);
            setShowAddressSelector(true);
            
            // Find default address
            const defaultAddress = addresses.find(addr => addr.isDefaultShipping);
            if (defaultAddress) {
              console.log('[CHECKOUT] Found default address:', defaultAddress);
              setSelectedAddress(defaultAddress);
              
              // Pre-fill address fields with explicit logging
              console.log('[CHECKOUT] Updating form with default address');
              setFormData(prevData => {
                const updatedData = {
                  ...prevData,
                  fullName: defaultAddress.fullName || prevData.fullName,
                  phone: defaultAddress.phoneNumber || prevData.phone,
                  address: defaultAddress.address || '',
                  city: defaultAddress.city || '',
                  postalCode: defaultAddress.postalCode || ''
                };
                console.log('[CHECKOUT] Form data updated with address');
                return updatedData;
              });
            } else {
              console.log('[CHECKOUT] No default address found, using first address');
              // If no default address, use the first one
              const firstAddress = addresses[0];
              setSelectedAddress(firstAddress);
              
              setFormData(prevData => ({
                ...prevData,
                fullName: firstAddress.fullName || prevData.fullName,
                phone: firstAddress.phoneNumber || prevData.phone,
                address: firstAddress.address || '',
                city: firstAddress.city || '',
                postalCode: firstAddress.postalCode || ''
              }));
            }
          } else {
            console.log('[CHECKOUT] No addresses found or invalid address data');
          }
        } catch (error) {
          console.error('[CHECKOUT] Error loading addresses:', error);
          // Try an alternative approach if the service fails
          if (user && user.shippingAddresses && Array.isArray(user.shippingAddresses)) {
            console.log('[CHECKOUT] Fallback: Using addresses from user object');
            setUserAddresses(user.shippingAddresses);
            setShowAddressSelector(true);
            
            if (user.shippingAddresses.length > 0) {
              const defaultAddress = user.shippingAddresses.find(addr => addr.isDefaultShipping) || 
                                    user.shippingAddresses[0];
              setSelectedAddress(defaultAddress);
              
              setFormData(prevData => ({
                ...prevData,
                fullName: defaultAddress.fullName || prevData.fullName,
                phone: defaultAddress.phoneNumber || prevData.phone,
                address: defaultAddress.address || '',
                city: defaultAddress.city || '',
                postalCode: defaultAddress.postalCode || ''
              }));
            }
          }
        }
      };
      
      // Run address fetching
      fetchAddresses();
    } else {
      console.log('[DEBUG][CHECKOUT] User not authenticated or user data missing');
    }
  }, [isAuthenticated, user]);
  
  // Add a new useEffect for debug logging and auth state
  useEffect(() => {
    console.log('[CHECKOUT] Auth state:', { isAuthenticated, user });
    console.log('[CHECKOUT] Cart state:', { 
      items: cart.items?.length || 0, 
      total: cart.total || 0 
    });
  }, [isAuthenticated, user, cart.items, cart.total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear phone error when user types
    if (name === 'phone') {
      setPhoneError('');
    }
  };

  // Payment debug info component
  const paymentDebugInfo = () => {
    if (paymentError) {
      return (
        <div className={styles.errorMessage}>
          <p>Erreur de paiement: {paymentError}</p>
          <button 
            onClick={() => handleStripeCheckout()}
            className={styles.retryButton}
          >
            Réessayer
          </button>
        </div>
      );
    }
    
    if (isProcessing) {
      return <p className={styles.processingMessage}>Configuration du paiement en cours...</p>;
    }
    
    return null;
  };
  
  // Ensure cart data is saved to all storage mechanisms
  const ensureCartIsSaved = () => {
    try {
      if (!cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
        console.warn('[CHECKOUT] Cannot save empty cart');
        return false;
      }
      
      // Create a complete cart object
      const cartData = {
        items: cart.items,
        total: cart.total
      };
      
      // Save to both storage mechanisms to ensure cross-page persistence
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      
      // Create a backup too
      if (cart.createCartBackup && typeof cart.createCartBackup === 'function') {
        cart.createCartBackup();
      }
      
      console.log('[CHECKOUT] Cart saved to all storage mechanisms:', cart.items.length, 'items');
      return true;
    } catch (error) {
      console.error('[CHECKOUT] Error saving cart before checkout:', error);
      return false;
    }
  };

  // Handler for Stripe Checkout Sessions API
  const handleStripeCheckout = async () => {
    // First, ensure the cart is saved to storage
    ensureCartIsSaved();
    
    // Validate phone number first
    const phoneValidationError = validatePhone(formData.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }
    
    try {
      setCheckoutLoading(true);
      setPaymentError('');
      setPhoneError('');
      
      // Get the MAD amount from finalTotal
      let madAmount = finalTotal;
      
      // Validate the amount (use at least 100 MAD for testing)
      if (isNaN(madAmount) || madAmount < 10) {
        console.warn('Using fallback amount for testing');
        madAmount = 100; // Minimum test amount
      }
      
      console.log('MAD amount for payment:', madAmount);
      
      // Direct conversion: 1 USD = 9.5 MAD
      const usdAmount = madAmount / 9.5;
      const roundedUsdAmount = Math.round(usdAmount * 100) / 100;
      
      console.log('Payment calculation:', {
        originalMAD: madAmount,
        conversionRate: '1 USD = 9.5 MAD',
        convertedUSD: roundedUsdAmount
      });
      
      // Prepare order data
      const orderData = {
        orderItems: items.map(item => ({
          product: item.productId,
          name: item.name,
          quantity: parseInt(item.quantity, 10) || 1,
          price: Number(item.price),
          size: item.size,
          color: item.color
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phoneNumber: formData.phone.replace(/\s+/g, ''),
          address: formData.address || '',
          city: formData.city || '',
          postalCode: formData.postalCode || '',
          country: 'Maroc'
        },
        paymentMethod: 'card',
        itemsPrice: Number(total),
        shippingPrice: 0,
        totalPrice: Number(total)
      };
      
      // Create the order in the backend first
      console.log('Creating order in backend:', orderData);
  
      try {
        // Get token if available
        const orderToken = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
        
        // Try direct fetch first as a fallback if orderService fails
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        console.log('[CHECKOUT] Using API base URL for order:', apiBase);
  
        // Clean the phone number before submission
        formData.phone = formData.phone.replace(/\s+/g, '');
  
        // Prepare headers - include Authorization only if token exists
        const headers = {
          'Content-Type': 'application/json'
        };
        if (orderToken) {
          headers['Authorization'] = `Bearer ${orderToken}`;
        }
  
        const orderResponse = await fetch(`${apiBase}/orders`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(orderData)
        });
  
        if (!orderResponse.ok) {
          const errorStatus = orderResponse.status;
          console.error(`[CHECKOUT] Order creation failed with status: ${errorStatus}`);
          
          // Try to parse error response
          let errorText = '';
          try {
            const errorData = await orderResponse.json();
            errorText = errorData.message || '';
            console.error('[CHECKOUT] Error details:', errorData);
          } catch (e) {
            errorText = await orderResponse.text();
            console.error('[CHECKOUT] Error response text:', errorText);
          }
          
          if (errorStatus === 401) {
            throw new Error('Vous devez être connecté pour passer une commande.');
          } else if (errorStatus === 404) {
            throw new Error('Le service de commande est temporairement indisponible. Veuillez réessayer plus tard.');
          } else {
            throw new Error(`Erreur lors de la création de la commande (${errorStatus})${errorText ? ': ' + errorText : ''}`);
          }
        }
  
        const createdOrder = await orderResponse.json();
        console.log('Order created:', createdOrder);

        // Add the code here:
        sessionStorage.setItem('thank-you-data', JSON.stringify(createdOrder));
        localStorage.setItem('thank-you-data', JSON.stringify(createdOrder));
        
        // Create backup of cart data for thank-you page
        try {
          // Save checkout form data
          const checkoutFormData = {
            fullName: formData.fullName,
            phone: formData.phone.replace(/\s+/g, ''),
            address: formData.address || '',
            city: formData.city || '',
            postalCode: formData.postalCode || ''
          };
          
          // Store in both session and local storage
          sessionStorage.setItem('checkout-form', JSON.stringify(checkoutFormData));
          localStorage.setItem('checkout-form', JSON.stringify(checkoutFormData));
          
          // Create explicit thank-you data
          const thankyouData = {
            orderItems: cart.items.map(item => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity || 1,
              size: item.size,
              color: item.color,
              image: item.image
            })),
            totalPrice: finalTotal,
            createdAt: new Date().toISOString(),
            orderNumber: `${Date.now().toString().slice(-6).padStart(6, '0')}`,
            paymentMethod: 'card',
            shippingAddress: {
              fullName: formData.fullName,
              phoneNumber: formData.phone.replace(/\s+/g, ''),
              address: formData.address || '',
              city: formData.city || '',
              postalCode: formData.postalCode || '',
              country: 'Maroc'
            }
          };
          
          // Store for thank-you page - with multiple mechanisms for redundancy
          sessionStorage.setItem('thank-you-data', JSON.stringify(thankyouData));
          localStorage.setItem('thank-you-data', JSON.stringify(thankyouData));
          
          // Create backup of cart data
          if (cart.createCartBackup && typeof cart.createCartBackup === 'function') {
            cart.createCartBackup();
          }
          
          console.log('[CHECKOUT] Saved order data for thank-you page');
        } catch (err) {
          console.error('[CHECKOUT] Failed to save thank-you data:', err);
        }
        
        // Now proceed with Stripe payment
        const stripeHeaders = {
          'Content-Type': 'application/json'
        };
        if (orderToken) {
          stripeHeaders['Authorization'] = `Bearer ${orderToken}`;
        }
        
        const response = await fetch(`${apiBase}/payments/create-checkout-session`, {
          method: 'POST',
          headers: stripeHeaders,
          body: JSON.stringify({
            madAmount,
            items: cart.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            customerPhone: formData.phone,
            orderId: createdOrder._id // Add order ID for reference
          }),
        });
        
        if (!response.ok) {
          const responseText = await response.text();
          console.error(`Server error (${response.status}):`, responseText);
          
          let errorData;
          try {
            errorData = JSON.parse(responseText);
            console.error("Parsed error data:", errorData);
          } catch (e) {
            console.error("Could not parse error response:", e);
            errorData = { error: responseText };
          }
          
          throw new Error(`Erreur du serveur de paiement: ${response.status} - ${errorData.error || responseText}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        if (!data || !data.url) {
          throw new Error('Réponse invalide du serveur de paiement');
        }
        
        console.log('Checkout session created successfully:', data);
        
        // Don't clear the cart immediately, wait until thank-you page is loaded
        // Mark it for clearing after redirect
        try {
          sessionStorage.setItem('clear-cart-after-redirect', 'true');
          console.log('[CHECKOUT] Marked cart for clearing after redirect');
        } catch (err) {
          console.error('[CHECKOUT] Failed to mark cart for clearing:', err);
        }
        
        // Final backup before redirect
        ensureCartIsSaved();
        
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } catch (orderError) {
        console.error('Order creation error:', orderError);
        setPaymentError(orderError.message || 'Une erreur est survenue lors de la création de la commande.');
        setCheckoutLoading(false);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setPaymentError(error.message || 'Échec de la configuration du paiement. Veuillez réessayer.');
      setCheckoutLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DEBUG][ORDER] Starting order submission');
    
    // First, ensure the cart is saved to storage
    ensureCartIsSaved();
    
    // Validate phone
    const phoneValidationError = validatePhone(formData.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }
    
    try {
      setSubmitting(true);
      setPaymentError(''); // Clear previous errors
      
      // Clean phone number once before preparing data
      const cleanedPhone = formData.phone.replace(/\s+/g, '');
      
      // Prepare the order data
      const orderData = {
        orderItems: items.map(item => ({
          product: item.productId,
          name: item.name,
          quantity: parseInt(item.quantity, 10) || 1,
          price: Number(item.price),
          size: item.size,
          color: item.color
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phoneNumber: cleanedPhone,
          address: formData.address || '',
          city: formData.city || '',
          postalCode: formData.postalCode || '',
          country: 'Maroc'
        },
        paymentMethod: 'cash',
        itemsPrice: Number(total),
        shippingPrice: 0,
        totalPrice: Number(total)
      };
      
      console.log('[CHECKOUT] Complete order data being sent:', JSON.stringify(orderData, null, 2));
      
      // Use orderService instead of direct fetch
      try {
        // Import debug utilities if in development
        if (process.env.NODE_ENV === 'development') {
          try {
            const { debugOrderSubmission } = require('@/utils/debug');
            debugOrderSubmission(orderData);
          } catch (err) {
            console.log('Debug utilities not available:', err);
          }
        }
        
        // Try direct fetch first as a fallback if orderService fails
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        console.log('[CHECKOUT] Using API base URL:', apiBase);
        
        // Get token if available
        const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
        
        // Prepare headers - include Authorization only if token exists
        const headers = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Make the fetch request
        const response = await fetch(`${apiBase}/orders`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
          const errorStatus = response.status;
          console.error(`[CHECKOUT] Order creation failed with status: ${errorStatus}`);
          
          // Try to parse error response
          let errorText = '';
          try {
            const errorData = await response.json();
            errorText = errorData.message || '';
            console.error('[CHECKOUT] Error details:', errorData);
          } catch (e) {
            errorText = await response.text();
            console.error('[CHECKOUT] Error response text:', errorText);
          }
          
          if (errorStatus === 401) {
            setPaymentError('Vous devez être connecté pour passer une commande.');
          } else if (errorStatus === 404) {
            setPaymentError('Le service de commande est temporairement indisponible. Veuillez réessayer plus tard.');
          } else {
            setPaymentError(`Erreur lors de la création de la commande (${errorStatus})${errorText ? ': ' + errorText : ''}`);
          }
          return;
        }
        
        const createdOrder = await response.json();
        console.log('[CHECKOUT] Order created successfully:', createdOrder);
        console.log('[CHECKOUT] Order data detail:', createdOrder);
        
        // Create backup of cart data for thank-you page
        try {
          // Save checkout form data
          const checkoutFormData = {
            fullName: formData.fullName,
            phone: formData.phone.replace(/\s+/g, ''),
            address: formData.address || '',
            city: formData.city || '',
            postalCode: formData.postalCode || ''
          };
    
          // Use the actual order data instead of creating custom data
sessionStorage.setItem('thank-you-data', JSON.stringify(createdOrder));
localStorage.setItem('thank-you-data', JSON.stringify(createdOrder));
          
          // Create backup of cart data
          if (cart.createCartBackup && typeof cart.createCartBackup === 'function') {
            cart.createCartBackup();
          }
          
          console.log('[CHECKOUT] Saved order data for thank-you page');
        } catch (err) {
          console.error('[CHECKOUT] Failed to save thank-you data:', err);
        }
        
        // Don't clear the cart immediately, wait until thank-you page is loaded
        // Mark it for clearing after redirect
        try {
          sessionStorage.setItem('clear-cart-after-redirect', 'true');
          console.log('[CHECKOUT] Marked cart for clearing after redirect');
        } catch (err) {
          console.error('[CHECKOUT] Failed to mark cart for clearing:', err);
        }
        
        // Final backup before redirect
        ensureCartIsSaved();
        
        // Navigate to thank you page
        try {
          router.push('/thank-you');
        } catch (navError) {
          console.error('[CHECKOUT] Router navigation failed:', navError);
          window.location.href = '/thank-you';
        }
      } catch (orderError) {
        console.error('[CHECKOUT] Order API error:', orderError);
        setPaymentError('Une erreur technique est survenue. Veuillez réessayer plus tard ou contacter le support.');
      }
    } catch (error) {
      console.error('[CHECKOUT] Order creation failed:', error);
      setPaymentError(error.message || 'Impossible de créer la commande. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle selecting an address from the user's saved addresses
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    
    // Update form data with the selected address
    setFormData({
      ...formData,
      fullName: address.fullName || formData.fullName,
      phone: address.phoneNumber || formData.phone,
      address: address.address || '',
      city: address.city || '',
      postalCode: address.postalCode || ''
    });
  };

  // Address selector component
  const AddressSelector = () => {
    if (!userAddresses || userAddresses.length === 0) return null;
    
    return (
      <div className={styles.addressSelectorContainer}>
        <h3>Utiliser une adresse enregistrée</h3>
        <div className={styles.addressOptions}>
          {userAddresses.map(address => (
            <div 
              key={address._id} 
              className={`${styles.addressOption} ${selectedAddress && selectedAddress._id === address._id ? styles.selected : ''}`}
              onClick={() => handleSelectAddress(address)}
            >
              <div className={styles.addressOptionContent}>
                <strong>{address.label || 'Adresse'}</strong>
                <p>{address.fullName}</p>
                <p>{address.address}</p>
                <p>{address.city}, {address.postalCode}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // If cart is empty after all restoration attempts, show empty cart message
  if (!cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
    console.log('[CHECKOUT] Cart is still empty after restoration attempts:', cart);
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutHeader}>
          <Link href="/" className={styles.logoContainer}>
            <Image 
              src="/assets/images/logos/brendt-complet-logo.svg"
              alt="BRENDT"
              width={160}
              height={40}
              className={styles.logo}
            />
          </Link>
        </div>
        <div className={styles.emptyCartMessage}>
          <h2>Votre panier est vide</h2>
          <p>Veuillez ajouter des articles à votre panier avant de finaliser votre commande.</p>
          <Link href="/categories" className={styles.continueShopping}>
            DÉCOUVRIR LA COLLECTION
          </Link>
        </div>
      </div>
    );
  }
  
  const items = cart.items || [];
  const total = cart.total || 0;
  const itemCount = cart.itemCount || 0;
  const formatPrice = cart.formatPrice || (price => `${price} MAD`);
  const shippingCost = 0;
  const finalTotal = total + shippingCost;

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutHeader}>
        <Link href="/" className={styles.logoContainer}>
          <Image 
            src="/assets/images/logos/brendt-complet-logo.svg"
            alt="BRENDT"
            width={160}
            height={40}
            className={styles.logo}
          />
        </Link>
      </div>

      {!isAuthenticated && (
        <div className={styles.accountBanner}>
          <p className={styles.accountQuestion}>Créez un compte pour profiter de nos avantages</p>
          <button 
            onClick={() => setShowSignupModal(true)} 
            className={styles.createAccountButton}
          >
            <span>Créer un compte</span>
            <span className={styles.discountBadge}>-10% sur votre première commande</span>
          </button>
        </div>
      )}

      <div className={styles.checkoutContent}>
        <div className={styles.checkoutForm}>
          {paymentDebugInfo()}
          
          {/* Show address selector for logged-in users */}
          {isAuthenticated && userAddresses.length > 0 && (
            <div className={styles.savedAddressesSection}>
              <button 
                type="button" 
                className={styles.toggleAddressBtn}
                onClick={() => setShowAddressSelector(!showAddressSelector)}
              >
                {showAddressSelector ? 'Masquer' : 'Choisir'} une adresse enregistrée
              </button>
              
              {showAddressSelector && <AddressSelector />}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.shippingDetails}>
              <h2 className={styles.sectionTitle}>Informations de livraison</h2>
                
              <div className={styles.formGroup}>
                <label htmlFor="fullName" className={styles.label}>Nom complet*</label>
                <input 
                  type="text" 
                  id="fullName"
                  name="fullName"
                  className={styles.input}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Numéro de téléphone*</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  className={styles.input}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: 06 12 34 56 78"
                />
                {phoneError && (
                  <p className={styles.errorMessage}>{phoneError}</p>
                )}
                <p className={styles.helperText}>
                  Format accepté: numéro marocain (06/07) ou international (+/00)
                </p>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>Adresse*</label>
                <input 
                  type="text" 
                  id="address"
                  name="address"
                  className={styles.input}
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>Ville*</label>
                <input 
                  type="text" 
                  id="city"
                  name="city"
                  className={styles.input}
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="postalCode" className={styles.label}>Code postal</label>
                <input 
                  type="text" 
                  id="postalCode"
                  name="postalCode"
                  className={styles.input}
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.deliveryEstimate}>
                <p>Livraison estimée à partir du {deliveryDate}</p>
              </div>
              
              <div className={styles.paymentButtons}>
                <button 
                  type="button"
                  onClick={handleStripeCheckout} 
                  disabled={checkoutLoading}
                  className={styles.onlinePaymentButton}
                >
                  {checkoutLoading ? 'REDIRECTION VERS STRIPE...' : 'PAYER AVEC CARTE'}
                  <span className={styles.discountTag}>-10%</span>
                </button>
                
                <button 
                  type="submit" 
                  className={styles.codButton}
                  disabled={submitting}
                >
                  {submitting ? 'TRAITEMENT EN COURS...' : 'PAYER À LA LIVRAISON'}
                </button>
              </div>

              <div className={styles.contactInfo}>
                <p>Besoin d'aide avec votre commande? Contactez-nous:</p>
                <a 
                  href="https://wa.me/33773436514" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.whatsappLink}
                >
                  <svg className={styles.whatsappIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.5 0 0 4.5 0 10C0 11.8 0.5 13.5 1.3 15L0 20L5.2 18.7C6.7 19.5 8.3 20 10 20C15.5 20 20 15.5 20 10C20 7.3 19 4.8 17.1 2.9C15.2 1 12.7 0 10 0ZM15.8 14.1C15.6 14.7 14.6 15.4 14 15.4C13.5 15.5 12.8 15.5 12.1 15.3C11.7 15.2 11.1 15 10.4 14.7C7.8 13.7 6.1 11.2 6 11C5.9 10.9 5 9.7 5 8.4C5 7.1 5.6 6.5 5.8 6.2C6 6 6.3 5.9 6.5 5.9C6.6 5.9 6.7 5.9 6.8 5.9C7 5.9 7.1 5.9 7.3 6.4C7.5 6.9 8 8.2 8 8.3C8.1 8.4 8.1 8.5 8 8.7C7.9 8.9 7.9 9 7.8 9.1C7.7 9.2 7.5 9.4 7.4 9.5C7.3 9.6 7.1 9.8 7.3 10.1C7.4 10.4 8 11.3 8.8 12C9.8 12.8 10.5 13.1 10.8 13.2C11 13.3 11.3 13.3 11.4 13.1C11.6 12.9 11.8 12.6 12 12.3C12.2 12.1 12.4 12.1 12.6 12.2C12.8 12.3 14.1 12.9 14.3 13C14.5 13.1 14.7 13.2 14.7 13.3C14.8 13.5 14.8 13.9 14.6 14.5L15.8 14.1Z" fill="#25D366"/>
                  </svg>
                  <span>+33 7 73 43 65 14</span>
                </a>
              </div>
            </div>
          </form>
        </div>
        
        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Mon panier</h2>
          <div className={styles.summaryCount}>{itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier</div>
          
          <div className={styles.cartItems}>
            {Array.isArray(items) && items.length > 0 ? (
              items.map((item, index) => (
                <div 
                  key={`${item.productId}-${item.color}-${item.size}-${index}`}
                  className={styles.cartItem}
                >
                  <div className={styles.itemImage}>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        width={60} 
                        height={80} 
                        className={styles.productImage}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.itemAttributes}>
                      <div className={styles.attributeItem}>
                        <span className={styles.attributeLabel}>Taille:</span>
                        <span className={styles.itemSize}>{item.size}</span>
                      </div>
                      <div className={styles.attributeItem}>
                        <span className={styles.attributeLabel}>Quantité:</span>
                        <span className={styles.itemQuantity}>{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyCartNotice}>
                Aucun article dans le panier
              </div>
            )}
          </div>
          
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>
            
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
          
          <Link href="/cart" className={styles.backToCartLink}>
            Retour au panier
          </Link>
        </div>
      </div>
      
      {showSignupModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Créer un compte BRENDT</h3>
              <button 
                onClick={() => setShowSignupModal(false)}
                className={styles.closeModal}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L15 15M1 15L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label htmlFor="signupName" className={styles.label}>Nom complet</label>
                <input 
                  type="text" 
                  id="signupName"
                  name="signupName"
                  className={styles.input}
                  value={formData.signupName || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="signupEmail" className={styles.label}>Adresse email</label>
                <input 
                  type="email" 
                  id="signupEmail"
                  name="signupEmail"
                  className={styles.input}
                  value={formData.signupEmail || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="signupPassword" className={styles.label}>Mot de passe</label>
                <input 
                  type="password" 
                  id="signupPassword"
                  name="signupPassword"
                  className={styles.input}
                  value={formData.signupPassword || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="signupPasswordConfirm" className={styles.label}>Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  id="signupPasswordConfirm"
                  name="signupPasswordConfirm"
                  className={styles.input}
                  value={formData.signupPasswordConfirm || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="signupAddress" className={styles.label}>Adresse</label>
                <textarea 
                  id="signupAddress"
                  name="signupAddress"
                  className={styles.textarea}
                  value={formData.signupAddress || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="signupPhone" className={styles.label}>Numéro de téléphone</label>
                <input 
                  type="tel" 
                  id="signupPhone"
                  name="signupPhone"
                  className={styles.input}
                  value={formData.signupPhone || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  className={styles.createAccountButton}
                  type="button"
                  onClick={() => {
                    console.log('Account creation', formData);
                    setShowSignupModal(false);
                  }}
                >
                  CRÉER MON COMPTE
                </button>
                <button 
                  className={styles.cancelButton}
                  type="button"
                  onClick={() => setShowSignupModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}