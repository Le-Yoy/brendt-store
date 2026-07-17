'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import productService from '@/services/productService';
import ProductCard from '@/components/products/ProductCard';
import styles from '../category/[categoryId]/CategoryPage.module.css';

/**
 * TARHAZOUT collection landing page — MEN only.
 * Dedicated URL (/tarhazout) for Meta ads: lists all Tarhazout raffia products
 * in the SAME grid as the regular category pages so visitors can browse every
 * color and click through to choose size/color on the product page.
 */
export default function TarhazoutPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTarhazout = async () => {
      setLoading(true);
      try {
        const result = await productService.getProducts({ limit: 200 });
        const allProducts = result.data?.data || result.data || result || [];

        // MEN Tarhazout raffia collection: the "Tarhazout" mocassin + "Anchor Point"
        // (same raffia line). Exclude the femme "Sandales Tarhazout".
        const isTarhazoutMen = (p) => {
          const name = (p.name || '').toLowerCase();
          const isMen = (p.gender || '').toLowerCase() === 'homme';
          const inCollection =
            name === 'tarhazout' || name === 'anchor point';
          return isMen && inCollection;
        };

        // De-duplicate by name (the DB has two identical "Anchor Point" entries).
        const seen = new Set();
        const collection = allProducts.filter((p) => {
          if (!isTarhazoutMen(p)) return false;
          const key = (p.name || '').toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setProducts(collection);
      } catch (error) {
        console.error('Error fetching Tarhazout products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTarhazout();
  }, []);

  // Same color-expansion logic as the category grid: one tile per color variant,
  // linking to /products/{originalProductId}?color=...&colorIndex=...
  const expandProductsWithColorVariants = (products) => {
    if (!products || products.length === 0) return [];

    const expandedProducts = [];

    products.forEach((product) => {
      if (product.colors && product.colors.length > 1) {
        product.colors.forEach((color, index) => {
          if (!color.images || color.images.length === 0) return;

          expandedProducts.push({
            ...product,
            _id: `${product._id}-color-${color.name
              .toLowerCase()
              .replace(/\s+/g, '-')}-${index}`,
            isColorVariant: true,
            originalProductId: product._id,
            displayImage: color.images[0],
            selectedColor: color,
            displayColorIndex: index,
          });
        });
      } else {
        expandedProducts.push(product);
      }
    });

    return expandedProducts;
  };

  const expandedProducts = expandProductsWithColorVariants(products);

  return (
    <div className={styles.categoryPage}>
      {/* Header */}
      <div className={styles.categoryHeader}>
        <h1 className={styles.categoryTitle}>TARHAZOUT</h1>
      </div>

      {/* Products */}
      <div className={styles.productsContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Chargement des produits...</p>
          </div>
        ) : expandedProducts.length ? (
          <div className={styles.productStandardGrid}>
            {expandedProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                product={{ ...product, _priority: index < 4 }}
                isFeatured={false}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noProducts}>
            <p>Aucun produit trouvé.</p>
            <Link href="/category/chaussures?gender=homme" className={styles.returnLink}>
              Voir toutes les chaussures homme
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
