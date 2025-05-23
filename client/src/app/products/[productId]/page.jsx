'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './ProductPage.module.css';

import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductAdditionalInfo from '@/components/product/ProductAdditionalInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

// Import the product service
import productService from '@/services/productService';

export default function ProductPage({ params }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // First try to get the product from the API
        const productData = await productService.getProduct(productId);
        // Handle both formats of API response (data property or direct)
        setProduct(productData.data || productData);
        setUsingMockData(false);
        
        // Set default selected color to first available
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        
        setLoading(false);
      } catch (apiError) {
        console.warn('API fetch failed, falling back to mock data:', apiError);
        
        try {
          // Fallback to mock data if API fails
          const mockData = await productService.getMockProduct(productId);
          setProduct(mockData);
          setUsingMockData(true);
          
          // Set default selected color to first available
          if (mockData.colors && mockData.colors.length > 0) {
            setSelectedColor(mockData.colors[0]);
          }
          
          setLoading(false);
        } catch (mockError) {
          console.error('Error fetching product:', mockError);
          setLoading(false);
        }
      }
    }

    fetchProduct();
    // Reset scroll position when product changes
    window.scrollTo(0, 0);
  }, [productId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Produit non trouvé</h2>
        <p>Nous n'avons pas pu trouver le produit demandé.</p>
      </div>
    );
  }

  // Optional data source indicator for development
  const dataSourceIndicator = process.env.NODE_ENV === 'development' && (
    <div className={`${styles.dataSource} ${usingMockData ? styles.mock : styles.api}`}>
      {usingMockData ? 'Données de test' : 'Données API'}
    </div>
  );

  return (
    <div className={styles.productPageContainer}>
      {dataSourceIndicator}
      <div className={styles.productContentWrapper}>
        <div className={styles.productGallerySection}>
          <ProductGallery 
            images={selectedColor ? selectedColor.images : product.colors[0].images} 
            productName={product.name}
          />
        </div>
        
        <div className={styles.productInfoSection}>
          <ProductInfo 
            product={product}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          <ProductAdditionalInfo product={product} />
        </div>
      </div>
      
      <div className={styles.relatedProductsSection}>
        <RelatedProducts 
          category={product.category} 
          currentProductId={product.id} 
          usingApi={!usingMockData}
        />
      </div>
    </div>
  );
}