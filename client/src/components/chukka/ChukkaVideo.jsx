'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ChukkaProduct.module.css';

/**
 * Muted looping video that only downloads/plays while on screen.
 * Off-screen videos show their poster and cost nothing — keeps the Chukka
 * pages light on mobile (all videos autoplaying used to pull ~11 MB).
 * `sound`: the video has a music track — starts muted (browsers require it),
 * with a button to turn the sound on.
 */
export default function ChukkaVideo({ media, label, className, sound = false }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true; // iOS only allows play() on muted videos
    setMuted(true);

    // No IntersectionObserver (very old browsers): just play.
    if (typeof IntersectionObserver === 'undefined') {
      video.preload = 'auto';
      video.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [media.src]);

  const toggleSound = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  const player = (
    <video
      ref={ref}
      key={media.src}
      className={className}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );

  if (!sound) return player;

  return (
    <div className={styles.soundWrap}>
      {player}
      <button type="button" className={styles.soundBtn} onClick={toggleSound} aria-pressed={!muted}>
        {muted ? '🔇 Activer le son' : '🔊 Couper le son'}
      </button>
    </div>
  );
}
