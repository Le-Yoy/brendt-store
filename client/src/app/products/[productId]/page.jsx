'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import styles from './ProductPage.module.css';

import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductAdditionalInfo from '@/components/product/ProductAdditionalInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

// Import the product service
import productService from '@/services/productService';

export default function ProductPage({ params }) {
  const { productId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // ✨ FIXED: Smooth URL update without reload
  const updateURL = useCallback((color, colorIndex) => {
    if (!color || !product) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('color', color.name || color);
    params.set('colorIndex', colorIndex.toString());
    
    // ✨ CRITICAL: Use shallow routing to prevent page reload
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(
      { ...window.history.state, url: newURL, as: newURL },
      '',
      newURL
    );
  }, [searchParams, product]);

  // ✨ FIXED: Smooth color change without page reload
  const handleColorChange = useCallback((color) => {
    if (!product || !product.colors) return;
    
    const colorIndex = product.colors.findIndex(c => c.name === color.name);
    if (colorIndex !== -1) {
      // ✨ Smooth state update - no page reload
      setSelectedColor(color);
      
      // ✨ Reset size selection when color changes
      setSelectedSize(null);
      
      // ✨ Update URL smoothly without reload
      updateURL(color, colorIndex);
    }
  }, [product, updateURL]);

  // ✨ Initial product fetch - only once
  useEffect(() => {
    let isMounted = true;
    
    async function fetchProduct() {
      if (!productId) return;
      
      try {
        setLoading(true);
        
        // First try to get the product from the API
        const productData = await productService.getProduct(productId);
        
        if (!isMounted) return;
        
        // Handle both formats of API response (data property or direct)
        const resolvedProduct = productData.data || productData;
        setProduct(resolvedProduct);
        setUsingMockData(false);
        
        // ✨ Set initial color based on URL or default to first
        if (resolvedProduct.colors && resolvedProduct.colors.length > 0) {
          const colorIndexParam = searchParams.get('colorIndex');
          const colorParam = searchParams.get('color');
          
          let targetColor = null;
          
          // Priority 1: Try to match by colorIndex from URL
          if (colorIndexParam !== null) {
            const colorIndex = parseInt(colorIndexParam);
            if (colorIndex >= 0 && colorIndex < resolvedProduct.colors.length) {
              targetColor = resolvedProduct.colors[colorIndex];
            }
          }
          
          // Priority 2: Try to match by color name from URL
          if (!targetColor && colorParam) {
            targetColor = resolvedProduct.colors.find(color => 
              color.name?.toLowerCase() === colorParam.toLowerCase()
            );
          }
          
          // Priority 3: Fall back to first color
          if (!targetColor) {
            targetColor = resolvedProduct.colors[0];
          }
          
          if (isMounted) {
            setSelectedColor(targetColor);
          }
        }
        
      } catch (apiError) {
        console.warn('API fetch failed, falling back to mock data:', apiError);
        
        if (!isMounted) return;
        
        try {
          // Fallback to mock data if API fails
          const mockData = await productService.getMockProduct(productId);
          
          if (!isMounted) return;
          
          setProduct(mockData);
          setUsingMockData(true);
          
          // Set initial color for mock data
          if (mockData.colors && mockData.colors.length > 0) {
            const colorIndexParam = searchParams.get('colorIndex');
            const colorParam = searchParams.get('color');
            
            let targetColor = null;
            
            if (colorIndexParam !== null) {
              const colorIndex = parseInt(colorIndexParam);
              if (colorIndex >= 0 && colorIndex < mockData.colors.length) {
                targetColor = mockData.colors[colorIndex];
              }
            }
            
            if (!targetColor && colorParam) {
              targetColor = mockData.colors.find(color => 
                color.name?.toLowerCase() === colorParam.toLowerCase()
              );
            }
            
            if (!targetColor) {
              targetColor = mockData.colors[0];
            }
            
            if (isMounted) {
              setSelectedColor(targetColor);
            }
          }
          
        } catch (mockError) {
          console.error('Error fetching product:', mockError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();
    
    return () => {
      isMounted = false;
    };
  }, [productId]); // ✨ CRITICAL: Only depend on productId, not searchParams

  // ✨ SMOOTH: Reset scroll only when productId changes, not on color change
  useEffect(() => {
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
            images={selectedColor ? selectedColor.images : product.colors[0]?.images || []} 
            productName={product.name}
          />
        </div>
        
        <div className={styles.productInfoSection}>
          <ProductInfo 
            product={product}
            selectedColor={selectedColor}
            setSelectedColor={handleColorChange}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          <ProductAdditionalInfo product={product} />
        </div>
      </div>
      
      <div className={styles.relatedProductsSection}>
        <RelatedProducts 
          category={product.category} 
          currentProductId={product.id || product._id} 
          usingApi={!usingMockData}
        />
      </div>
    </div>
  );
}