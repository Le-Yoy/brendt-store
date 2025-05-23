import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import productService from '@/services/productService';
import styles from './CollectionCard.module.css';

export default function CollectionCard({ collection }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        if (!collection.productIds || collection.productIds.length === 0) {
          setProducts([]);
          return;
        }
        
        // Fetch each product by ID
        const productPromises = collection.productIds.map(id => 
          productService.getProduct(id)
            .then(res => {
              return res.data?.data || res.data || res;
            })
            .catch(e => {
              console.error(`Failed to fetch product ${id}:`, e);
              return null;
            })
        );
        
        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts.filter(p => p !== null));
      } catch (err) {
        console.error('Error fetching collection products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [collection.productIds]);
  
  if (!collection) return null;
  
  const { id, title, description, image } = collection;
  
  const productImages = products.map(product => 
    product.images && product.images.length > 0 
      ? product.images[0] 
      : '/assets/images/placeholder.png'
  );
  
  return (
    <div className={styles.collectionCard}>
      <div className={styles.collectionContent}>
        <h3 className={styles.collectionTitle}>{title}</h3>
        <p className={styles.collectionDescription}>{description}</p>
        
        <div className={styles.productPreview}>
          {loading ? (
            <div className={styles.loadingIndicator}>
              <span>Chargement...</span>
            </div>
          ) : (
            <>
              {productImages.slice(0, 2).map((imgSrc, index) => (
                <div key={index} className={styles.previewItem}>
                  <Image 
                    src={imgSrc}
                    alt={`Product ${index + 1} in ${title} collection`}
                    width={80}
                    height={80}
                    className={styles.previewImage}
                  />
                </div>
              ))}
              {products.length > 2 && (
                <div className={styles.previewMore}>
                  +{products.length - 2}
                </div>
              )}
            </>
          )}
        </div>
        
        <Link href={`/collections/${id}`} className={styles.collectionLink}>
          Découvrir la collection
        </Link>
      </div>
      
      <div className={styles.collectionImageContainer}>
      <Image 
  src={image}
  alt={title}
  fill
  sizes="(max-width: 768px) 100vw, 33vw"
  className={styles.collectionImage}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
/>
        <div className={styles.imageOverlay}></div>
      </div>
    </div>
  );
}