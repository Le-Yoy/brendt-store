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

    // Start only once the browser can play to the end without pausing to
    // buffer — playing on the first frames made phones stutter.
    let visible = false;
    const playWhenReady = () => {
      if (visible) video.play().catch(() => {});
    };
    video.addEventListener('canplaythrough', playWhenReady);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          video.preload = 'auto';
          if (video.readyState >= 3) playWhenReady(); // already buffered (seen before)
          else if (video.readyState === 0) video.load(); // first time: fetch, canplaythrough plays it
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener('canplaythrough', playWhenReady);
    };
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
      <button
        type="button"
        className={styles.soundBtn}
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? 'Activer le son' : 'Couper le son'}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M4 9h4l5-4v14l-5-4H4z" strokeLinejoin="round" />
          {muted ? (
            <path d="M17 9.5l5 5M22 9.5l-5 5" strokeLinecap="round" />
          ) : (
            <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </div>
  );
}
