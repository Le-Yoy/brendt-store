'use client';

import { useEffect, useRef } from 'react';

/**
 * Muted looping video that only downloads/plays while on screen.
 * Off-screen videos show their poster and cost nothing — keeps the Chukka
 * pages light on mobile (all videos autoplaying used to pull ~11 MB).
 */
export default function ChukkaVideo({ media, label, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true; // iOS only allows play() on muted videos

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

  return (
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
}
