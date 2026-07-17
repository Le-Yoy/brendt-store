'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import styles from './ProductPage.module.css';

import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RaffiaAcompteNote from '@/components/product/RaffiaAcompteNote';
import ProductAdditionalInfo from '@/components/product/ProductAdditionalInfo';
import RelatedProducts from '@/components/product/RelatedProducts';
import { trackViewContent } from '@/utils/facebookPixel';

// Import the product service
import productService from '@/services/productService';

export default function ProductPage({ params }) {
  const { productId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Enhanced SEO meta tags for product pages targeting Morocco keywords
  useEffect(() => {
    if (product) {
      // Title with Morocco location and price
      const title = `${product.name} Maroc - ${product.subcategory || 'Chaussures'} ${product.gender || ''} ${product.price} MAD | BRENDT`;
      document.title = title;
      
      // Rich description with Morocco cities and delivery info
      const description = `${product.name} au Maroc ✓ Prix: ${product.price} MAD ✓ ${product.subcategory} ${product.gender} de luxe ✓ Livraison gratuite Casablanca, Rabat, Marrakech ✓ Paiement cash à la livraison`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;

      // Product-specific Morocco keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      const keywords = `${product.name} maroc, ${product.subcategory} ${product.gender} maroc, chaussures maroc, brendt maroc, ${product.subcategory} ${product.price} mad, livraison gratuite maroc`;
      metaKeywords.content = keywords;

      // Open Graph for social sharing with Morocco focus
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = `${product.name} - ${product.price} MAD | BRENDT Maroc`;

      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.content = description;

      // Enhanced structured data for Google Shopping and Morocco market
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description || `${product.subcategory} ${product.gender} de luxe disponible au Maroc`,
        "brand": {
          "@type": "Brand",
          "name": "BRENDT"
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "MAD",
          "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "BRENDT",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "MA"
            }
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "MAD"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "businessDays": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
              }
            }
          }
        },
        "category": product.category,
        "color": product.colors ? product.colors.map(c => c.name).join(", ") : "",
        "material": "Cuir italien",
        "manufacturer": {
          "@type": "Organization",
          "name": "BRENDT"
        }
      };

      const scriptTag = document.getElementById('product-schema') || document.createElement('script');
      scriptTag.id = 'product-schema';
      scriptTag.type = 'application/ld+json';
      scriptTag.innerHTML = JSON.stringify(productSchema);
      if (!document.getElementById('product-schema')) {
        document.head.appendChild(scriptTag);
      }
    }
  }, [product]);

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

  // ✨ Initial product fetch - retries on user request
  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      if (!productId) return;

      try {
        setLoading(true);
        setFetchError(false);
        
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

        // Track Facebook Pixel ViewContent event
        if (isMounted && resolvedProduct) {
          trackViewContent(resolvedProduct);
        }
        
      } catch (apiError) {
        console.error('Error fetching product:', apiError);
        if (isMounted) {
          setFetchError(true);
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
  }, [productId, retryCount]);

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
        <p>Nous n'avons pas pu charger ce produit. Vérifiez votre connexion et réessayez.</p>
        <button
          onClick={() => { setProduct(null); setRetryCount(c => c + 1); }}
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', cursor: 'pointer', background: '#000', color: '#fff', border: 'none' }}
        >
          Réessayer
        </button>
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
          <RaffiaAcompteNote product={product} />
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