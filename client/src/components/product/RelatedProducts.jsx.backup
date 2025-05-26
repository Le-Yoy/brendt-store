import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMockProducts } from '@/utils/mockData';
import productService from '@/services/productService';
import styles from './RelatedProducts.module.css';

const RelatedProducts = ({ category, currentProductId, usingApi = false }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        let products = [];
        
        if (usingApi) {
          try {
            console.log("Attempting API call with category:", category);
            const options = { category: category, limit: 4 };
            const result = await productService.getProducts(options);
            console.log("API response:", result);
            
            // Handle nested data structure from your API
            products = result.data?.data || result.data || result || [];
          } catch (apiError) {
            console.error('API error:', apiError);
          }
        }
        
        // If usingApi failed or was false, try mock data
        if (products.length === 0) {
          try {
            products = await getMockProducts({ category }) || [];
          } catch (mockError) {
            console.error('Mock data error:', mockError);
            products = [];
          }
        }
        
        // Get either 4 products for desktop or 6 for mobile
        const isMobile = window.innerWidth <= 768;
        const limitCount = isMobile ? 6 : 4;
        
        // Filter out current product and take up to limit count
        setRelatedProducts(
          products
            .filter(product => product.id !== currentProductId)
            .slice(0, limitCount)
        );
      } catch (error) {
        console.error('Error in RelatedProducts:', error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    }
  
    if (category && currentProductId) {
      fetchRelatedProducts();
    }
    
    // Load wishlist from localStorage if available
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error parsing wishlist:', e);
      }
    }
  }, [category, currentProductId, usingApi]);
  
  const toggleWishlist = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  if (loading) {
    return (
      <div className={styles.relatedProductsContainer}>
        <h2 className={styles.sectionTitle}>Vous aimerez aussi</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className={styles.relatedProductsContainer}>
      <h2 className={styles.sectionTitle}>Vous aimerez aussi</h2>
      
      <div className={styles.relatedProductsGrid}>
        {relatedProducts.map(product => (
          <Link href={`/products/${product.id}`} key={product.id} className={styles.productCard}>
            <div className={styles.productImageContainer}>
              <Image
                src={product.colors[0]?.images[0] || '/assets/images/placeholder.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.productImage}
              />
              <button 
                className={`${styles.wishlistButton} ${wishlist.includes(product.id) ? styles.active : ''}`}
                onClick={(e) => toggleWishlist(e, product.id)}
                aria-label={wishlist.includes(product.id) ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
              >
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.heartIcon}>
                  <path d="M9 16L7.695 14.823C3.06 10.657 0 7.897 0 4.674C0 2.05 2.178 0 4.95 0C6.516 0 8.019 0.707 9 1.813C9.981 0.707 11.484 0 13.05 0C15.822 0 18 2.05 18 4.674C18 7.897 14.94 10.657 10.305 14.833L9 16Z" fill="currentColor" stroke="var(--color-accent)" strokeWidth="1"/>
                </svg>
              </button>
              <div className={styles.hoverInfo}>
                <div className={styles.infoBox}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productColor}>{product.colors[0]?.name || 'Default'}</p>
                  <p className={styles.productPrice}>{product.price} dh</p>
                </div>
              </div>
            </div>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productColor}>{product.colors[0]?.name || 'Default'}</p>
              <p className={styles.productPrice}>{product.price} €</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;