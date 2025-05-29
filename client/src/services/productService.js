// src/services/productService.js

import mockData from '@/utils/mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://brendt-store-production-d6ef.up.railway.app/api';

/**
 * Service for handling product-related API calls with fallback to mock data
 */
class ProductService {
  /**
   * Fetch a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} - Product data
   */
  async getProduct(id) {
    try {
      console.log(`Fetching product with ID: ${id}`);
      const response = await fetch(`${API_URL}/products/${id}`);
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Error fetching product: ${response.statusText}`);
      }
      
      const product = await response.json();
      console.log('Product data received:', product);
      return product;
    } catch (error) {
      console.error('Product fetch error:', error);
      // Only fall back to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for product');
        return mockData.getProductById(id);
      }
      throw error;
    }
  }

  /**
   * Fetch products with filtering options
   * @param {Object} options - Filter options
   * @param {string} [options.category] - Category filter
   * @param {string} [options.subcategory] - Subcategory filter
   * @param {string} [options.gender] - Gender filter ('homme' or 'femme')
   * @param {string} [options.sort] - Sort option (newest, price-asc, price-desc, name-asc, name-desc)
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=12] - Items per page
   * @returns {Promise<Object>} - Products data with pagination info
   */
  async getProducts(options = {}) {
    const {
      category,
      subcategory,
      gender,
      sort = 'newest',
      page = 1,
      limit = 12,
      search
    } = options;
    try {
      // Build query string from options
      const queryParams = new URLSearchParams();
      
      if (category) queryParams.append('category', category);
      if (subcategory) queryParams.append('subcategory', subcategory);
      if (gender) queryParams.append('gender', gender);
      if (sort) queryParams.append('sort', sort);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      
      console.log(`API Request: ${API_URL}/products?${queryParams.toString()}`);
      const response = await fetch(`${API_URL}/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Error fetching products: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`API Response: ${data.data?.length || 0} products received`);
      return data;
    } catch (error) {
      console.error('Products fetch error:', error);
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for products');
        return mockData.getProducts({
          category,
          subcategory,
          gender,
          sort,
          page,
          limit,
          search
        });
      }
      throw error;
    }
  }

  /**
   * Fetch all categories with subcategories
   * @param {string} [gender] - Optional gender filter ('homme' or 'femme')
   * @returns {Promise<Array>} - Categories data
   */
  async getCategories(gender) {
    try {
      console.log(`Fetching categories${gender ? ` for ${gender}` : ''}`);
      
      const url = gender 
        ? `${API_URL}/categories?gender=${gender}` 
        : `${API_URL}/categories`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`Error fetching categories: ${response.statusText}`);
      }
      
      const categories = await response.json();
      console.log(`Categories received: ${categories.length || 0}`);
      return categories;
    } catch (error) {
      console.error('Categories fetch error:', error);
      // Only fall back to mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for categories');
        return mockData.getCategories(gender);
      }
      throw error;
    }
  }
}

export default new ProductService();
