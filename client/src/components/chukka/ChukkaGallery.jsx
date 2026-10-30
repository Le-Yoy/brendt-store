'use client';

import { useState, useEffect, useRef } from 'react';
import { chukkaColor, photoSrcSet } from './chukkaMedia';
import styles from './ChukkaProduct.module.css';

/**
 * Photo gallery for the Chukka Grainé product page (replaces ProductGallery
 * for this product only). Photos only — the video is in the hero above.
 * Mobile: swipe one photo at a time with dots. Desktop: 2-column grid.
 */
export default function ChukkaGallery({ selectedColor }) {
  const color = chukkaColor(selectedColor?.name);
  const photos = color.media.filter((m) => m.type === 'image');
  const [slide, setSlide] = useState(0);
  const trackRef = useRef(null);

  // Back to the first photo when the color changes.
  useEffect(() => {
    setSlide(0);
    if (trackRef.current) trackRef.current.scrollTo({ left: 0 });
  }, [color.name]);

  const onScroll = () => {
    const el = trackRef.current;
    if (el) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={styles.gallery}>
      <div ref={trackRef} className={styles.track} onScroll={onScroll}>
        {photos.map((p, i) => (
          <div key={p.src} className={styles.slide}>
            <img
              src={p.src}
              srcSet={photoSrcSet(p.src)}
              sizes="(min-width: 1024px) 30vw, 100vw"
              alt={`Chukka Grainé ${color.name} — photo ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              className={styles.photo}
            />
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className={`${styles.dot} ${i === slide ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
