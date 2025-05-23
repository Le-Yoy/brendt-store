// src/services/addressService.js
import api from '../utils/api/apiUtils';

/**
 * Address Service - Handles shipping address management
 */
const addressService = {
  /**
   * Get all shipping addresses for the current user
   * @returns {Promise<Array>} List of user's shipping addresses
   */
  getUserAddresses: async () => {
    console.log('[DEBUG][ADDRESS] Starting getUserAddresses request');
    try {
      // Get auth token manually to ensure it's included
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      
      if (!token) {
        console.log('[DEBUG][ADDRESS] No auth token found, cannot fetch addresses');
        return [];
      }
      
      // Make a direct fetch call with explicit headers
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(`[DEBUG][ADDRESS] API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      console.log('[DEBUG][ADDRESS] Profile response:', data);
      
      // Extract addresses with multiple fallback paths
      let addresses = [];
      
      if (data.shippingAddresses) {
        addresses = data.shippingAddresses;
        console.log('[DEBUG][ADDRESS] Found addresses in root object:', addresses.length);
      } else if (data.data && data.data.shippingAddresses) {
        addresses = data.data.shippingAddresses;
        console.log('[DEBUG][ADDRESS] Found addresses in data property:', addresses.length);
      } else if (data.user && data.user.shippingAddresses) {
        addresses = data.user.shippingAddresses;
        console.log('[DEBUG][ADDRESS] Found addresses in user property:', addresses.length);
      }
      
      // Validate it's an array
      if (!Array.isArray(addresses)) {
        console.error('[DEBUG][ADDRESS] Addresses is not an array:', addresses);
        return [];
      }
      
      // Normalize the address objects
      const normalizedAddresses = addresses.map(address => ({
        _id: address._id || address.id || Date.now().toString(),
        label: address.label || 'Adresse',
        fullName: address.fullName || '',
        phoneNumber: address.phoneNumber || '',
        address: address.address || '',
        additionalInfo: address.additionalInfo || '',
        city: address.city || '',
        postalCode: address.postalCode || '',
        country: address.country || 'Maroc',
        isDefaultShipping: address.isDefaultShipping || false,
        isDefaultBilling: address.isDefaultBilling || false
      }));
      
      console.log('[DEBUG][ADDRESS] Normalized addresses:', normalizedAddresses.length);
      return normalizedAddresses;
    } catch (error) {
      console.error('[DEBUG][ADDRESS] Get addresses error:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Add a new shipping address
   * @param {Object} addressData - Shipping address data
   * @returns {Promise<Array>} Updated list of shipping addresses
   */
  addAddress: async (addressData) => {
    console.log('[DEBUG][ADDRESS] Adding new address:', addressData);
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      
      if (!token) {
        console.error('[DEBUG][ADDRESS] No auth token found, cannot add address');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/users/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[DEBUG][ADDRESS] Add address API error: ${response.status}`, errorText);
        throw new Error(`Failed to add address: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[DEBUG][ADDRESS] Add address response:', data);
      
      // Extract addresses array from response, with fallbacks
      const addresses = data.shippingAddresses || 
                       (data.data && data.data.shippingAddresses) ||
                       (data.user && data.user.shippingAddresses) || [];
                       
      if (!Array.isArray(addresses)) {
        console.warn('[DEBUG][ADDRESS] Add address: Response does not contain address array');
        // Fallback to getting fresh address list
        return await addressService.getUserAddresses();
      }
      
      return addresses;
    } catch (error) {
      console.error('[DEBUG][ADDRESS] Add address error:', error);
      throw error;
    }
  },

  /**
   * Update an existing shipping address
   * @param {string} addressId - ID of the address to update
   * @param {Object} addressData - Updated address data
   * @returns {Promise<Array>} Updated list of shipping addresses
   */
  updateAddress: async (addressId, addressData) => {
    console.log('[DEBUG][ADDRESS] Updating address:', addressId, addressData);
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      
      if (!token) {
        console.error('[DEBUG][ADDRESS] No auth token found, cannot update address');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/users/address/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
      
      if (!response.ok) {
        console.error(`[DEBUG][ADDRESS] Update address API error: ${response.status}`);
        throw new Error(`Failed to update address: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[DEBUG][ADDRESS] Update address response:', data);
      
      // Extract addresses array from response, with fallbacks
      const addresses = data.shippingAddresses || 
                       (data.data && data.data.shippingAddresses) ||
                       (data.user && data.user.shippingAddresses) || [];
                       
      if (!Array.isArray(addresses)) {
        console.warn('[DEBUG][ADDRESS] Update address: Response does not contain address array');
        // Fallback to getting fresh address list
        return await addressService.getUserAddresses();
      }
      
      return addresses;
    } catch (error) {
      console.error('[DEBUG][ADDRESS] Update address error:', error);
      throw error;
    }
  },

  /**
   * Delete a shipping address
   * @param {string} addressId - ID of the address to delete
   * @returns {Promise<Array>} Updated list of shipping addresses
   */
  deleteAddress: async (addressId) => {
    console.log('[DEBUG][ADDRESS] Deleting address:', addressId);
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      
      if (!token) {
        console.error('[DEBUG][ADDRESS] No auth token found, cannot delete address');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/users/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error(`[DEBUG][ADDRESS] Delete address API error: ${response.status}`);
        throw new Error(`Failed to delete address: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[DEBUG][ADDRESS] Delete address response:', data);
      
      // Extract addresses array from response, with fallbacks
      const addresses = data.shippingAddresses || 
                       (data.data && data.data.shippingAddresses) ||
                       (data.user && data.user.shippingAddresses) || [];
                       
      if (!Array.isArray(addresses)) {
        console.warn('[DEBUG][ADDRESS] Delete address: Response does not contain address array');
        // Fallback to getting fresh address list
        return await addressService.getUserAddresses();
      }
      
      return addresses;
    } catch (error) {
      console.error('[DEBUG][ADDRESS] Delete address error:', error);
      throw error;
    }
  },

  /**
   * Set an address as the default shipping address
   * @param {string} addressId - ID of the address to set as default
   * @returns {Promise<Array>} Updated list of shipping addresses
   */
  setDefaultAddress: async (addressId) => {
    console.log('[DEBUG][ADDRESS] Setting default address:', addressId);
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('auth-token');
      
      if (!token) {
        console.error('[DEBUG][ADDRESS] No auth token found, cannot set default address');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/users/address/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isDefaultShipping: true })
      });
      
      if (!response.ok) {
        console.error(`[DEBUG][ADDRESS] Set default address API error: ${response.status}`);
        throw new Error(`Failed to set default address: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[DEBUG][ADDRESS] Set default address response:', data);
      
      // Extract addresses array from response, with fallbacks
      const addresses = data.shippingAddresses || 
                       (data.data && data.data.shippingAddresses) ||
                       (data.user && data.user.shippingAddresses) || [];
                       
      if (!Array.isArray(addresses)) {
        console.warn('[DEBUG][ADDRESS] Set default address: Response does not contain address array');
        // Fallback to getting fresh address list
        return await addressService.getUserAddresses();
      }
      
      return addresses;
    } catch (error) {
      console.error('[DEBUG][ADDRESS] Set default address error:', error);
      throw error;
    }
  },

  /**
   * Get the user's default shipping address
   * @returns {Promise<Object|null>} Default address or null if none is set
   */
  getDefaultAddress: async () => {
    console.log('[DEBUG][ADDRESS] Getting default address');
    try {
      const addresses = await addressService.getUserAddresses();
      const defaultAddress = addresses.find(address => address.isDefaultShipping) || null;
      console.log('[DEBUG][ADDRESS] Default address found:', !!defaultAddress);
      return defaultAddress;
    } catch (error) {
      console.error('[DEBUG][ADDRESS] Get default address error:', error);
      return null;
    }
  }
};

export default addressService;