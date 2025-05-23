import React, { useEffect, useState, forwardRef } from 'react';
import productService from '@/services/productService';
import GiftProductCard from './GiftProductCard';
import styles from './SignatureGifts.module.css';

const SignatureGifts = forwardRef(({ filters }, ref) => {
  const [signatureProducts, setSignatureProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Featured product IDs specified in the design brief
  const featuredProductIds = [
    '67d607dc033ca42b418411f8', // Agafay Walk mocassins
    '67d607dc033ca42b418411f6', // Turin derbies
    '67d607dc033ca42b4184121a', // Stitch sneakers
    '67d607dc033ca42b418411d8', // Trousse De Toilettes
  ];

  // Fallback product data in case API fails
  const fallbackProducts = [
    {
      id: '67d607dc033ca42b418411f8',
      name: 'Agafay Walk',
      price: 450,
      category: 'Chaussures',
      subcategory: 'Mocassins',
      description: 'Un mocassin élégant au cuir souple et à la finition impeccable, idéal pour un cadeau qui allie confort et raffinement.',
      images: ['/assets/images/products/agafay-walk.jpg']
    },
    {
      id: '67d607dc033ca42b418411f6',
      name: 'Turin',
      price: 520,
      category: 'Chaussures',
      subcategory: 'Derbies',
      description: 'Une derby sophistiquée en cuir premium, parfaite pour marquer une occasion professionnelle importante.',
      images: ['/assets/images/products/turin.jpg']
    },
    {
      id: '67d607dc033ca42b4184121a',
      name: 'Stitch',
      price: 380,
      category: 'Chaussures',
      subcategory: 'Sneakers',
      description: 'Une sneaker luxueuse combinant artisanat traditionnel et design contemporain, pour un cadeau d\'exception au quotidien.',
      images: ['/assets/images/products/stitch.jpg']
    },
    {
      id: '67d607dc033ca42b418411d8',
      name: 'Trousse De Toilettes',
      price: 220,
      category: 'Accessoires',
      subcategory: 'Voyage',
      description: 'Une trousse de toilette en cuir pleine fleur, compagnon idéal pour les voyages d\'affaires et les escapades de détente.',
      images: ['/assets/images/products/Trousse.jpg']
        }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch each product by ID using Promise.all for parallel requests
        const productPromises = featuredProductIds.map(id => 
          productService.getProduct(id)
            .then(res => {
              // Handle various response formats
              return res.data?.data || res.data || res;
            })
            .catch(e => {
              console.error(`Failed to fetch product ${id}:`, e);
              // Return the fallback product instead of null
              return fallbackProducts.find(p => p.id === id);
            })
        );
        
        const products = await Promise.all(productPromises);
        // Filter out null values and ensure we have at least the fallback products
        const validProducts = products.filter(p => p !== null);
        
        if (validProducts.length === 0) {
          // If no products were fetched successfully, use fallback products
          setSignatureProducts(fallbackProducts);
        } else {
          setSignatureProducts(validProducts);
        }
      } catch (err) {
        console.error('Error fetching signature products:', err);
        setError('Unable to load signature products');
        // Use fallback products on error
        setSignatureProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply active filters
  const filteredProducts = signatureProducts.filter(product => {
    // Skip filtering if 'all' is selected or if filters are not applicable
    if (!filters || filters.occasion === 'all') {
      return true;
    }
    
    // Rest of your filtering logic...
    return true; // Default to showing all products if filters don't apply
  });

  // Elegant loading state
  if (loading) {
    return (
      <section ref={ref} className={styles.signatureGiftsSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Nos Signatures</h2>
            <p>Des créations intemporelles, dignes des occasions les plus précieuses</p>
          </div>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingIndicator}>
              <span>Découverte des cadeaux signature...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no products match the current filters
  if (filteredProducts.length === 0) {
    return (
      <section ref={ref} className={styles.signatureGiftsSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Nos Signatures</h2>
            <p>Des créations intemporelles, dignes des occasions les plus précieuses</p>
          </div>
          <div className={styles.noResultsContainer}>
            <p>Aucun produit ne correspond à votre sélection actuelle.</p>
            <p>Ajustez vos critères pour découvrir nos pièces signature.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={styles.signatureGiftsSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>Nos Signatures</h2>
          <p>Des créations intemporelles, dignes des occasions les plus précieuses</p>
        </div>
        
        <div className={styles.giftsShowcase}>
          {filteredProducts.map(product => (
            <GiftProductCard 
              key={product.id || product._id} 
              product={product} 
              presentation="signature"
            />
          ))}
        </div>
      </div>
    </section>
  );
});

SignatureGifts.displayName = 'SignatureGifts';

export default SignatureGifts;