import { useState } from 'react';
import Link from 'next/link';
import styles from './RecommendedProducts.module.css';

const RecommendedProducts = () => {
  // Static products to avoid API fetch errors
  const [products] = useState([
    {
      _id: 'derby1',
      name: 'Derby Premium Cuir',
      price: 1850,
      image: '/assets/images/products/brendt-new/Homme/chaussures/derbies/derby1.webp'
    },
    {
      _id: 'mocassin1',
      name: 'Mocassin Classic',
      price: 1650,
      image: '/assets/images/products/brendt-new/Homme/chaussures/mocassins/mocassin1.webp'
    },
    {
      _id: 'boot1',
      name: 'Boot Élégant',
      price: 2150,
      image: '/assets/images/products/brendt-new/Homme/chaussures/boots/boot1.webp'
    },
    {
      _id: 'sneaker1',
      name: 'Sneaker Premium',
      price: 1750,
      image: '/assets/images/products/brendt-new/Homme/chaussures/sneaker/sneaker1.webp'
    }
  ]);
  
  // Format price with French formatting
  const formatPrice = (price) => {
    return `${price.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} MAD`;
  };
  
  return (
    <div className={styles.recommendedSection}>
      <h2>Vous pourriez également aimer</h2>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <Link href={`/products/${product._id}`} key={product._id} className={styles.productCard}>
            <div className={styles.productImage}>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  width={250}
                  height={200}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  {product.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;