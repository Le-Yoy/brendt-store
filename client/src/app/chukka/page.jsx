'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import productService from '@/services/productService';
import { useRegion } from '@/contexts/RegionContext';
import styles from './ChukkaPage.module.css';

/**
 * CHUKKA GRAINÉ showcase landing page — MEN boots.
 * Dedicated URL (/chukka) for Meta ads. Mobile-first funnel: above the fold =
 * name + price/COD/free delivery + "Choisir ma couleur" + a short muted video;
 * right below, a 2×2 color picker (→ product page ?color=…&colorIndex=…);
 * then one showcase section per color; a sticky "Commander" bar on phones.
 * Media is static (public/assets); links/prices use the live DB product.
 * Ads point at /chukka and at the color links — keep both URL shapes.
 */
import {
  CHUKKA_COLORS as COLORS,
  COLLECTION_VIDEO,
  isChukka,
  photoSrcSet,
  photosOf,
  preloadPhotos,
} from '@/components/chukka/chukkaMedia';
import ChukkaVideo from '@/components/chukka/ChukkaVideo';
import OldPrice from '@/components/chukka/OldPrice';

const MEDIA_SIZES = '(min-width: 1024px) 33vw, (min-width: 768px) 34vw, 78vw';
const CARD_SIZES = '(min-width: 1024px) 22vw, 46vw';

// Landing order: never Bleu Navy next to Noir (they look alike on a phone).
const LANDING_ORDER = ['Noir', 'Bleu', 'Marron', 'Bleu Navy'];
const LANDING_COLORS = LANDING_ORDER.map((name) => COLORS.find((c) => c.name === name));

// Ad attribution params carried from /chukka to the product page.
const KEEP_PARAMS = /^(utm_|fbclid$)/;

function ShowcaseVideo({ media, label, sound }) {
  return <ChukkaVideo media={media} label={label} className={styles.video} sound={sound} />;
}

export default function ChukkaPage() {
  const { formatProduct, isMorocco } = useRegion();
  const [product, setProduct] = useState(null);
  const [adParams, setAdParams] = useState('');
  const [showSticky, setShowSticky] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const heroCtaRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    const fetchChukka = async () => {
      try {
        const result = await productService.getProducts({ limit: 200 });
        const allProducts = result.data?.data || result.data || result || [];
        const found = allProducts.find(isChukka);
        setProduct(found || null);
      } catch (error) {
        console.error('Error fetching Chukka product:', error);
      }
    };

    fetchChukka();
  }, []);

  // After load, fetch every section's photos in page order (Noir → … → Bleu).
  useEffect(() => preloadPhotos(LANDING_COLORS.flatMap(photosOf), MEDIA_SIZES), []);

  useEffect(() => {
    const kept = new URLSearchParams();
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (KEEP_PARAMS.test(key)) kept.append(key, value);
    });
    setAdParams(kept.toString());
  }, []);

  // Sticky bar only when neither the hero button nor the color picker is on screen.
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
    if (!product) return null;
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
      {/* Hero — everything that sells is above the fold on a phone */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Collection Homme · Boots</p>
          <h1 className={styles.title}>Chukka Grainé</h1>
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
            Cuir grainé, doublure moutarde et semelle épaisse et légère.
            Une chukka confortable pour tous les jours, en quatre couleurs.
          </p>
          <button ref={heroCtaRef} type="button" className={styles.heroCta} onClick={scrollToPicker}>
            Choisir ma couleur
          </button>
        </div>
        <div className={styles.heroMedia}>
          <ShowcaseVideo media={COLLECTION_VIDEO} label="Chukka Grainé — toutes les couleurs" sound />
        </div>
      </section>

      {/* Color picker — 2×2 on phones */}
      <section ref={pickerRef} id="couleurs" className={styles.picker} aria-label="Choisissez votre couleur">
        {LANDING_COLORS.map((c) => {
          const href = productHref(c.name) || '/category/chaussures?gender=homme';
          const cover = photosOf(c)[0];
          return (
            <Link key={c.name} href={href} className={styles.card}>
              <span className={styles.cardMedia}>
                <img
                  src={cover}
                  srcSet={photoSrcSet(cover)}
                  sizes={CARD_SIZES}
                  alt={`Chukka Grainé ${c.name}`}
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
              <span className={styles.cardCta}>Commander</span>
            </Link>
          );
        })}
      </section>

      {/* One section per color */}
      {LANDING_COLORS.map((c) => {
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
                  {price && <span className={styles.ctaPrice}>{price}</span>}
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
                      sizes={MEDIA_SIZES}
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

      {/* Phones: sticky "Commander" bar → color sheet → product page */}
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
            {LANDING_COLORS.map((c) => (
              <Link
                key={c.name}
                href={productHref(c.name) || '/category/chaussures?gender=homme'}
                className={styles.sheetRow}
              >
                <img src={photosOf(c)[0].replace(/\.webp$/, '-800.webp')} alt="" className={styles.sheetThumb} />
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
