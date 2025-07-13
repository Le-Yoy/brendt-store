// Google Analytics 4 Configuration for Morocco Campaign
export const GA_MEASUREMENT_ID = 'G-YQQBFRN2E0'; // Replace with your actual ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      // Morocco-specific configuration
      country: 'MA',
      currency: 'MAD',
      custom_map: {
        'custom_parameter_1': 'morocco_campaign'
      }
    });
  }
};

// Track Morocco-specific events
export const trackMoroccoEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      // Add Morocco context to all events
      country: 'MA',
      currency: 'MAD',
      campaign_source: 'morocco_focus',
      ...parameters
    });
  }
};

// E-commerce tracking for Morocco
export const trackMoroccoPurchase = (orderData) => {
  trackMoroccoEvent('purchase', {
    transaction_id: orderData.orderId,
    value: orderData.total,
    currency: 'MAD',
    items: orderData.items.map(item => ({
      item_id: item._id,
      item_name: item.name,
      category: item.category || 'shoes',
      quantity: item.quantity,
      price: item.price
    }))
  });
};

export const trackMoroccoAddToCart = (product) => {
  trackMoroccoEvent('add_to_cart', {
    currency: 'MAD',
    value: product.price,
    items: [{
      item_id: product._id,
      item_name: product.name,
      category: product.category || 'shoes',
      price: product.price,
      quantity: 1
    }]
  });
};

export const trackMoroccoPageView = (pageTitle, pagePath) => {
  trackMoroccoEvent('page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: pagePath,
    country_focus: 'morocco'
  });
};

// WhatsApp campaign tracking
export const trackWhatsAppTraffic = (source = 'whatsapp') => {
  trackMoroccoEvent('campaign_click', {
    campaign_source: source,
    campaign_medium: 'social',
    campaign_name: 'morocco_whatsapp_2025',
    traffic_type: 'morocco_focused'
  });
};

// Newsletter signup tracking
export const trackMoroccoNewsletter = (email) => {
  trackMoroccoEvent('newsletter_signup', {
    method: 'website',
    country: 'MA',
    campaign_focus: 'morocco'
  });
};

// Contact form tracking
export const trackMoroccoContact = (formType = 'general') => {
  trackMoroccoEvent('contact_form_submit', {
    form_type: formType,
    country: 'MA',
    lead_source: 'website'
  });
};