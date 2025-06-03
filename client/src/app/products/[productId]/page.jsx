'use client';

import { useState, useEffect } from 'react';
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

  // Function to update URL when color changes
  const updateURL = (color, colorIndex) => {
    const params = new URLSearchParams(searchParams);
    params.set('color', color.name || color);
    params.set('colorIndex', colorIndex.toString());
    
    // Replace current URL without adding to history
    const newURL = `${window.location.pathname}?${params.toString()}`;
    router.replace(newURL, { scroll: false });
  };

  // Enhanced setSelectedColor that also updates URL
  const handleColorChange = (color) => {
    if (product && product.colors) {
      const colorIndex = product.colors.findIndex(c => c.name === color.name);
      if (colorIndex !== -1) {
        setSelectedColor(color);
        updateURL(color, colorIndex);
      }
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        // First try to get the product from the API
        const productData = await productService.getProduct(productId);
        // Handle both formats of API response (data property or direct)
        const resolvedProduct = productData.data || productData;
        setProduct(resolvedProduct);
        setUsingMockData(false);
        
        // Check URL parameters for color selection
        const colorIndexParam = searchParams.get('colorIndex');
        const colorParam = searchParams.get('color');
        
        if (resolvedProduct.colors && resolvedProduct.colors.length > 0) {
          let targetColor = null;
          
          // Priority 1: Try to match by colorIndex from URL
          if (colorIndexParam !== null) {
            const colorIndex = parseInt(colorIndexParam);
            if (colorIndex >= 0 && colorIndex < resolvedProduct.colors.length) {
              targetColor = resolvedProduct.colors[colorIndex];
            }
          }
          
          // Priority 2: Try to match by color name from URL if colorIndex didn't work
          if (!targetColor && colorParam) {
            targetColor = resolvedProduct.colors.find(color => 
              color.name?.toLowerCase() === colorParam.toLowerCase()
            );
          }
          
          // Priority 3: Fall back to first color
          if (!targetColor) {
            targetColor = resolvedProduct.colors[0];
          }
          
          setSelectedColor(targetColor);
        }
        
        setLoading(false);
      } catch (apiError) {
        console.warn('API fetch failed, falling back to mock data:', apiError);
        
        try {
          // Fallback to mock data if API fails
          const mockData = await productService.getMockProduct(productId);
          setProduct(mockData);
          setUsingMockData(true);
          
          // Check URL parameters for color selection
          const colorIndexParam = searchParams.get('colorIndex');
          const colorParam = searchParams.get('color');
          
          if (mockData.colors && mockData.colors.length > 0) {
            let targetColor = null;
            
            // Priority 1: Try to match by colorIndex from URL
            if (colorIndexParam !== null) {
              const colorIndex = parseInt(colorIndexParam);
              if (colorIndex >= 0 && colorIndex < mockData.colors.length) {
                targetColor = mockData.colors[colorIndex];
              }
            }
            
            // Priority 2: Try to match by color name from URL if colorIndex didn't work
            if (!targetColor && colorParam) {
              targetColor = mockData.colors.find(color => 
                color.name?.toLowerCase() === colorParam.toLowerCase()
              );
            }
            
            // Priority 3: Fall back to first color
            if (!targetColor) {
              targetColor = mockData.colors[0];
            }
            
            setSelectedColor(targetColor);
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
  }, [productId, searchParams]);

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
          currentProductId={product.id} 
          usingApi={!usingMockData}
        />
      </div>
    </div>
  );
}