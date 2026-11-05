'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import productService from '@/services/productService';
import { useRegion } from '@/contexts/RegionContext';
import { photoSrcSet, preloadPhotos } from '@/components/chukka/chukkaMedia';
import ChukkaVideo from '@/components/chukka/ChukkaVideo';
import OldPrice from '@/components/chukka/OldPrice';
import styles from '../chukka/ChukkaPage.module.css';
import own from './BrendtfordPage.module.css';
import { BRENDTFORD_COLORS as COLORS, HERO_VIDEO, isBrendtford } from './brendtfordMedia';

/**
 * BRENDTFORD landing page — same funnel as /chukka, for Meta ads.
 * Above the fold on a phone: name + price/COD/free delivery + "Choisir ma couleur"
 * + the short Noir video; then 3 color cards (→ product page ?color=…&colorIndex=…),
 * one photo section per color, and a sticky "Commander" bar.
 * Ads point at /brendtford and at the color links — keep both URL shapes.
 */
const MEDIA_SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 34vw, 78vw';
const CARD_SIZES = '(min-width: 1024px) 30vw, 32vw';

// Ad attribution params carried to the product page.
const KEEP_PARAMS = /^(utm_|fbclid$)/;

export default function BrendtfordPage() {
  const { formatProduct, isMorocco } = useRegion();
  const [product, setProduct] = useState(null);
  const [adParams, setAdParams] = useState('');
  const [showSticky, setShowSticky] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const heroCtaRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await productService.getProducts({ limit: 200 });
        const allProducts = result.data?.data || result.data || result || [];
        setProduct(allProducts.find(isBrendtford) || null);
      } catch (error) {
        console.error('Error fetching Brendtford product:', error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => preloadPhotos(COLORS.flatMap((c) => [c.pair, ...c.photos]), MEDIA_SIZES), []);

  useEffect(() => {
    const kept = new URLSearchParams();
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (KEEP_PARAMS.test(key)) kept.append(key, value);
    });
    setAdParams(kept.toString());
  }, []);

  // Sticky bar only when neither the hero button nor the color cards are on screen.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => visible.set(e.target, e.isIntersecting));
      setShowSticky(![...visible.values()].some(Boolean));
    });
    [heroCtaRef.current, pickerRef.current].filter(Boolean).forEach((el) => {
      visible.set(el, true);
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e) => e.key === 'Escape' && setSheetOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheetOpen]);

  // Link to the real product page for a given color (never a synthetic id).
  const productHref = (colorName) => {
    if (!product) return '/category/chaussures?gender=homme';
    const index = (product.colors || []).findIndex((c) => c.name === colorName);
    const base = index === -1
      ? `/products/${product._id}?`
      : `/products/${product._id}?color=${encodeURIComponent(colorName)}&colorIndex=${index}&`;
    return (base + adParams).replace(/[?&]$/, '');
  };

  const price = product ? formatProduct(product) : null;
  const scrollToPicker = () =>
    pickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Collection Homme · Slip-on</p>
          <h1 className={styles.title}>Brendtford</h1>
          <p className={styles.offer}>
            <OldPrice product={product} className={styles.oldPrice} />
            {price && <strong className={styles.offerPrice}>{price}</strong>}
            {isMorocco && (
              <>
                <span className={styles.offerDot} aria-hidden="true">·</span>
                <span>Paiement à la livraison</span>
                <span className={styles.offerDot} aria-hidden="true">·</span>
                <span>Livraison gratuite</span>
              </>
            )}
          </p>
          <p className={styles.lead}>
            Cuir grainé, élastiques croisés et semelle noire.
            Un slip-on sans lacets, en trois couleurs.
          </p>
          <button ref={heroCtaRef} type="button" className={styles.heroCta} onClick={scrollToPicker}>
            Choisir ma couleur
          </button>
        </div>
        <div className={styles.heroMedia}>
          <ChukkaVideo media={HERO_VIDEO} label="Brendtford Noir — vidéo" className={styles.video} sound />
        </div>
      </section>

      <section
        ref={pickerRef}
        id="couleurs"
        className={`${styles.picker} ${own.picker}`}
        aria-label="Choisissez votre couleur"
      >
        {COLORS.map((c) => (
          <Link key={c.name} href={productHref(c.name)} className={styles.card}>
            <span className={styles.cardMedia}>
              <img
                src={c.pair}
                srcSet={photoSrcSet(c.pair)}
                sizes={CARD_SIZES}
                alt={`Brendtford ${c.name}`}
                className={styles.photo}
                fetchPriority="high"
              />
            </span>
            <span className={styles.cardName}>
              <span className={styles.swatch} style={{ background: c.swatch }} />
              {c.name}
            </span>
            {price && (
              <span className={styles.cardPrice}>
                <OldPrice product={product} className={styles.oldPrice} /> {price}
              </span>
            )}
            <span className={`${styles.cardCta} ${own.cardCta}`}>Commander</span>
          </Link>
        ))}
      </section>

      {COLORS.map((c) => (
        <section key={c.name} id={c.folder} className={styles.colorSection}>
          <div className={styles.colorHeader}>
            <h2 className={styles.colorTitle}>
              <span className={styles.swatch} style={{ background: c.swatch }} />
              {c.name}
            </h2>
            {product && (
              <Link href={productHref(c.name)} className={styles.cta}>
                <span>Commander en {c.name}</span>
                {price && <span className={styles.ctaPrice}>{price}</span>}
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </Link>
            )}
          </div>
          <div className={styles.mediaRow}>
            {c.photos.map((src, i) => (
              <div key={src} className={styles.mediaItem}>
                <img
                  src={src}
                  srcSet={photoSrcSet(src)}
                  sizes={MEDIA_SIZES}
                  alt={`Brendtford ${c.name} — photo ${i + 1}`}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className={styles.photo}
                />
              </div>
            ))}
          </div>
          <p className={styles.swipeHint}>Faites glisser pour voir plus →</p>
        </section>
      ))}

      <div className={`${styles.sticky} ${showSticky && !sheetOpen ? styles.stickyShown : ''}`}>
        <button type="button" className={styles.stickyBtn} onClick={() => setSheetOpen(true)}>
          Commander{price ? ` — ${price}` : ''}
        </button>
      </div>

      {sheetOpen && (
        <div className={styles.sheetBackdrop} onClick={() => setSheetOpen(false)}>
          <div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Choisissez votre couleur"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sheetHead}>
              <p className={styles.sheetTitle}>Choisissez votre couleur</p>
              <button type="button" className={styles.sheetClose} onClick={() => setSheetOpen(false)} aria-label="Fermer">
                ×
              </button>
            </div>
            {COLORS.map((c) => (
              <Link key={c.name} href={productHref(c.name)} className={styles.sheetRow}>
                <img src={c.pair.replace(/\.webp$/, '-800.webp')} alt="" className={styles.sheetThumb} />
                <span className={styles.sheetName}>{c.name}</span>
                <span className={styles.sheetArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
