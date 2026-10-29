'use client';

import { useRegion } from '@/contexts/RegionContext';
import { CHUKKA_COLORS, chukkaColor } from './chukkaMedia';
import styles from './ChukkaProduct.module.css';

/**
 * Top band of the Chukka Grainé product page — same look as the /chukka hero:
 * text + color buttons on one side, the selected color's video on the other.
 * Color buttons drive the page's selected color; the CTA scrolls to sizes/cart.
 */
export default function ChukkaProductHero({ product, selectedColor, onColorChange }) {
  const { formatProduct } = useRegion();
  const active = chukkaColor(selectedColor?.name);

  const pick = (name) => {
    const color = (product.colors || []).find((c) => c.name === name);
    if (color) onColorChange(color);
  };

  const scrollToBuy = () => {
    const el = document.getElementById('acheter');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <p className={styles.kicker}>Collection Homme · Boots</p>
        <h1 className={styles.title}>Chukka Grainé</h1>
        <p className={styles.price}>{formatProduct(product)}</p>
        <p className={styles.lead}>
          Cuir grainé, doublure moutarde et semelle épaisse et légère.
          Une chukka confortable pour tous les jours.
        </p>

        <p className={styles.colorLabel}>
          Couleur : <strong>{active.name}</strong>
        </p>
        <div className={styles.swatches} role="radiogroup" aria-label="Couleur">
          {CHUKKA_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={c.name === active.name}
              className={`${styles.swatchBtn} ${c.name === active.name ? styles.swatchBtnActive : ''}`}
              onClick={() => pick(c.name)}
            >
              <span className={styles.swatch} style={{ background: c.swatch }} />
              {c.name}
            </button>
          ))}
        </div>

        <button type="button" className={styles.cta} onClick={scrollToBuy}>
          <span>Choisir ma pointure</span>
          <span className={styles.ctaArrow} aria-hidden="true">↓</span>
        </button>
      </div>

      <div className={styles.heroMedia}>
        <video
          key={active.video.src}
          className={styles.video}
          src={active.video.src}
          poster={active.video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`Chukka Grainé ${active.name} — vidéo`}
        />
      </div>
    </section>
  );
}
