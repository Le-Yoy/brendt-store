'use client';

import { useRegion } from '@/contexts/RegionContext';
import { chukkaColor } from './chukkaMedia';
import ChukkaVideo from './ChukkaVideo';
import styles from './ChukkaProduct.module.css';

/**
 * Top band of the Chukka Grainé product page — same look as the /chukka hero:
 * text on one side, the selected color's video on the other. The color is
 * picked below the photos (ProductInfo); the CTA scrolls there.
 */
export default function ChukkaProductHero({ product, selectedColor }) {
  const { formatProduct } = useRegion();
  const active = chukkaColor(selectedColor?.name);

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
        <button type="button" className={styles.cta} onClick={scrollToBuy}>
          <span>Choisir ma pointure</span>
          <span className={styles.ctaArrow} aria-hidden="true">↓</span>
        </button>
      </div>

      <div className={styles.heroMedia}>
        <ChukkaVideo
          media={active.video}
          label={`Chukka Grainé ${active.name} — vidéo`}
          className={styles.video}
        />
      </div>
    </section>
  );
}
