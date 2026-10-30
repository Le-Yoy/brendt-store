'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import productService from '@/services/productService';
import ProductCard from '@/components/products/ProductCard';
import { useRegion } from '@/contexts/RegionContext';
import styles from './ChukkaPage.module.css';

/**
 * CHUKKA GRAINÉ showcase landing page — MEN boots.
 * Dedicated URL (/chukka) for Meta ads: collection video, then one section per
 * color (video + photos + CTA), then the standard color-tile grid so visitors
 * can click through to choose size/color on the product page → cart → checkout.
 * Media is static (public/assets); the CTA/grid use the live DB product.
 */
import {
  CHUKKA_COLORS as COLORS,
  COLLECTION_VIDEO,
  isChukka,
  photoSrcSet,
} from '@/components/chukka/chukkaMedia';
import ChukkaVideo from '@/components/chukka/ChukkaVideo';

function ShowcaseVideo({ media, label, sound }) {
  return <ChukkaVideo media={media} label={label} className={styles.video} sound={sound} />;
}

export default function ChukkaPage() {
  const { formatProduct } = useRegion();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChukka = async () => {
      setLoading(true);
      try {
        const result = await productService.getProducts({ limit: 200 });
        const allProducts = result.data?.data || result.data || result || [];
        const found = allProducts.find(isChukka);
        setProduct(found || null);
      } catch (error) {
        console.error('Error fetching Chukka product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChukka();
  }, []);

  // Link to the real product page for a given color (never a synthetic id).
  const productHref = (colorName) => {
    if (!product) return null;
    const index = (product.colors || []).findIndex((c) => c.name === colorName);
    if (index === -1) return `/products/${product._id}`;
    return `/products/${product._id}?color=${encodeURIComponent(colorName)}&colorIndex=${index}`;
  };

  // Same color-expansion logic as the category grid: one tile per color.
  const colorTiles = (product?.colors || [])
    .map((color, index) => ({ color, index }))
    .filter(({ color }) => color.images && color.images.length > 0)
    .map(({ color, index }) => ({
      ...product,
      _id: `${product._id}-color-${color.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      isColorVariant: true,
      originalProductId: product._id,
      displayImage: color.images[0],
      selectedColor: color,
      displayColorIndex: index,
    }));

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Collection Homme · Boots</p>
          <h1 className={styles.title}>Chukka Grainé</h1>
          {product && <p className={styles.price}>{formatProduct(product)}</p>}
          <p className={styles.lead}>
            Cuir grainé, doublure moutarde et semelle épaisse et légère.
            Une chukka confortable pour tous les jours, en quatre couleurs.
          </p>
          <div className={styles.swatches}>
            {COLORS.map((c) => (
              <a key={c.name} href={`#${c.folder}`} className={styles.swatchLink}>
                <span className={styles.swatch} style={{ background: c.swatch }} />
                {c.name}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.heroMedia}>
          <ShowcaseVideo media={COLLECTION_VIDEO} label="Chukka Grainé — toutes les couleurs" sound />
        </div>
      </section>

      {/* One section per color */}
      {COLORS.map((c) => {
        const href = productHref(c.name);
        return (
          <section key={c.name} id={c.folder} className={styles.colorSection}>
            <div className={styles.colorHeader}>
              <h2 className={styles.colorTitle}>
                <span className={styles.swatch} style={{ background: c.swatch }} />
                {c.name}
              </h2>
              {href && (
                <Link href={href} className={styles.cta}>
                  <span>Commander en {c.name}</span>
                  {product && <span className={styles.ctaPrice}>{formatProduct(product)}</span>}
                  <span className={styles.ctaArrow} aria-hidden="true">→</span>
                </Link>
              )}
            </div>
            <div className={styles.mediaRow}>
              {c.media.map((m, i) => (
                <div key={m.src} className={styles.mediaItem}>
                  {m.type === 'video' ? (
                    <ShowcaseVideo media={m} label={`Chukka Grainé ${c.name} — vidéo`} />
                  ) : (
                    <img
                      src={m.src}
                      srcSet={photoSrcSet(m.src)}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 34vw, 78vw"
                      alt={`Chukka Grainé ${c.name} — photo ${i + 1}`}
                      loading={i < 2 ? 'eager' : 'lazy'}
                      className={styles.photo}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className={styles.swipeHint}>Faites glisser pour voir plus →</p>
          </section>
        );
      })}

      {/* Shop grid (live product) */}
      <section className={styles.shop}>
        <h2 className={styles.shopTitle}>Choisissez votre couleur</h2>
        {loading ? (
          <div className={styles.loading}>Chargement…</div>
        ) : colorTiles.length ? (
          <div className={styles.grid}>
            {colorTiles.map((tile, index) => (
              <ProductCard
                key={tile._id}
                product={{ ...tile, _priority: index < 2 }}
                isFeatured={false}
              />
            ))}
          </div>
        ) : (
          <div className={styles.loading}>
            <Link href="/category/chaussures?gender=homme">
              Voir toutes les chaussures homme
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
