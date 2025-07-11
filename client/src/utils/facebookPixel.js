// client/src/utils/facebookPixel.js

// Check consent before tracking (GDPR compliance)
export const checkConsentBeforeTracking = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const consent = localStorage.getItem('brendt-cookie-consent');
    if (!consent) return true; // If no consent stored, allow (non-EU users)
    
    const consentData = JSON.parse(consent);
    return consentData.accepted && consentData.analytics;
  } catch (error) {
    console.error('Error checking consent:', error);
    return true; // Fallback to allow
  }
};

// Currency mapping for Morocco context
const getCurrency = (price) => {
  // Default to MAD for Moroccan customers, but can be EUR or USD
  // This will be determined by your checkout logic
  return 'MAD'; // Default currency
};

// Normalize price to consistent format
const normalizePrice = (price, currency = 'MAD') => {
  if (typeof price === 'string') {
    price = parseFloat(price.replace(/[^\d.-]/g, ''));
  }
  return isNaN(price) ? 0 : Number(price.toFixed(2));
};

export const trackEvent = (eventName, parameters = {}) => {
  // Check consent first
  if (!checkConsentBeforeTracking()) {
    console.log(`[FB Pixel] Tracking blocked - no consent for ${eventName}`);
    return;
  }

  if (typeof window !== 'undefined' && window.fbq) {
    // Add default currency if not specified
    if (parameters.value && !parameters.currency) {
      parameters.currency = getCurrency(parameters.value);
    }
    
    console.log(`[FB Pixel] Tracking ${eventName}:`, parameters);
    window.fbq('track', eventName, parameters);
  }
};

// E-commerce specific events for BRENDT Morocco
export const trackPurchase = (orderData) => {
  // Check consent first
  if (!checkConsentBeforeTracking()) return;

  const currency = orderData.currency || 'MAD';
  const value = normalizePrice(orderData.totalPrice, currency);
  
  trackEvent('Purchase', {
    value: value,
    currency: currency,
    content_ids: orderData.items ? orderData.items.map(item => item._id || item.productId) : [],
    content_type: 'product',
    num_items: orderData.items ? orderData.items.length : 0,
    // Morocco-specific parameters
    content_name: 'BRENDT Shoes Purchase',
    content_category: 'Footwear'
  });
};

export const trackAddToCart = (product, quantity = 1, currency = 'MAD') => {
  // Check consent first
  if (!checkConsentBeforeTracking()) return;

  const value = normalizePrice(product.price * quantity, currency);
  
  trackEvent('AddToCart', {
    value: value,
    currency: currency,
    content_ids: [product._id || product.productId],
    content_type: 'product',
    content_name: product.name,
    content_category: product.category || 'Shoes',
    // Morocco context
    num_items: quantity
  });
};

export const trackViewContent = (product, currency = 'MAD') => {
  // Check consent first
  if (!checkConsentBeforeTracking()) return;

  const value = normalizePrice(product.price, currency);
  
  trackEvent('ViewContent', {
    value: value,
    currency: currency,
    content_ids: [product._id || product.id],
    content_type: 'product',
    content_name: product.name,
    content_category: product.category || 'Shoes'
  });
};

export const trackInitiateCheckout = (cartData, currency = 'MAD') => {
  // Check consent first
  if (!checkConsentBeforeTracking()) return;

  const totalValue = cartData.items ? 
    cartData.items.reduce((sum, item) => sum + (normalizePrice(item.price) * (item.quantity || 1)), 0) : 
    normalizePrice(cartData.total || 0);
  
  trackEvent('InitiateCheckout', {
    value: totalValue,
    currency: currency,
    content_ids: cartData.items ? cartData.items.map(item => item._id || item.productId) : [],
    content_type: 'product',
    num_items: cartData.items ? cartData.items.length : 0
  });
};

export const trackSearch = (searchTerm) => {
  // Check consent first
  if (!checkConsentBeforeTracking()) return;

  trackEvent('Search', {
    search_string: searchTerm,
    content_category: 'Shoes'
  });
};

// Lead tracking for Morocco
export const trackLead = (leadType = 'general') => {
  // Check consent first
  if (!checkConsentBeforeTracking()) return;

  trackEvent('Lead', {
    content_name: `BRENDT ${leadType} Lead`,
    content_category: 'Lead Generation'
  });
};

// Custom events for BRENDT
export const trackNewsletterSignup = () => {
  // Check consent first
  if (!checkConsentBeforeTracking()) return;

  trackEvent('CompleteRegistration', {
    content_name: 'Newsletter Signup',
    content_category: 'Engagement'
  });
};

export const trackContactForm = () => {
  // Check consent first
  if (!checkConsentBeforeTracking()) return;

  trackEvent('Contact', {
    content_name: 'Contact Form',
    content_category: 'Customer Service'
  });
};