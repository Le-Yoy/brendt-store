// Chukka Grainé media (static assets), shared by the /chukka landing page and
// the Chukka product page. Each color lists its media in display order:
// always open on the clearest asset (studio photo, or the video for Bleu),
// then a lifestyle shot (from brendt-ads, same images as the Meta ads).
export const CHUKKA_NAME = 'chukka grainé';

const IMG = '/assets/images/products/brendt-new/Homme/chaussures/boots/Chukka-Graine';
const VID = '/assets/videos/chukka';

const photo = (folder, n) => ({ type: 'image', src: `${IMG}/${folder}/${n}.webp` });
const lifestyle = (folder, scene) => ({ type: 'image', src: `${IMG}/${folder}/lifestyle-${scene}.webp` });
const video = (name) => ({
  type: 'video',
  src: `${VID}/${name}.mp4`,
  poster: `${VID}/${name}-poster.webp`,
});

// 10s collection cut with the ad's music (3x speed, even frame step = no judder).
export const COLLECTION_VIDEO = video('collection-short');

export const CHUKKA_COLORS = [
  {
    name: 'Noir',
    folder: 'Noir',
    swatch: '#111111',
    video: video('noir'),
    media: [
      photo('Noir', 1), lifestyle('Noir', 'cafe'), video('noir'), lifestyle('Noir', 'gallery'),
      photo('Noir', 2), lifestyle('Noir', 'stilllife'), photo('Noir', 3), photo('Noir', 4), photo('Noir', 5),
    ],
  },
  {
    name: 'Bleu Navy',
    folder: 'Bleu-Navy',
    swatch: '#1f2a44',
    video: video('bleu-navy'),
    media: [photo('Bleu-Navy', 1), lifestyle('Bleu-Navy', 'bench'), video('bleu-navy'), photo('Bleu-Navy', 2), photo('Bleu-Navy', 3), photo('Bleu-Navy', 4)],
  },
  {
    name: 'Marron',
    folder: 'Marron',
    swatch: '#4a3226',
    video: video('marron'),
    media: [photo('Marron', 1), lifestyle('Marron', 'station'), video('marron'), photo('Marron', 2), photo('Marron', 3), photo('Marron', 4)],
  },
  {
    name: 'Bleu',
    folder: 'Bleu',
    swatch: '#2f5f9e',
    video: video('bleu'),
    media: [video('bleu'), photo('Bleu', 1), lifestyle('Bleu', 'gallery'), photo('Bleu', 2), photo('Bleu', 3)],
  },
];

export const isChukka = (product) =>
  (product?.name || '').toLowerCase() === CHUKKA_NAME;

export const chukkaColor = (name) =>
  CHUKKA_COLORS.find((c) => c.name === name) || CHUKKA_COLORS[0];

// Responsive photos: every N.webp (1200w) has an N-800.webp sibling for phones.
export const photoSrcSet = (src) => `${src.replace(/\.webp$/, '-800.webp')} 800w, ${src} 1200w`;

// Warm the browser cache with every photo, in display order, once the page
// has finished loading (+ a short pause so the first photo/video go first).
// Uses the same srcset/sizes as the <img>, so the browser fetches the exact
// file it will show — swiping a carousel then never flashes an empty box.
export function preloadPhotos(srcs, sizes, delay = 1500) {
  let cancelled = false;
  let timer;
  const queue = [...new Set(srcs)];

  const next = () => {
    if (cancelled || !queue.length) return;
    const src = queue.shift();
    const img = new Image();
    img.onload = img.onerror = next; // one at a time: never competes with what's on screen
    img.sizes = sizes;
    img.srcset = photoSrcSet(src);
    img.src = src;
  };

  const start = () => { timer = setTimeout(next, delay); };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  return () => {
    cancelled = true;
    clearTimeout(timer);
    window.removeEventListener('load', start);
  };
}

export const photosOf = (color) => color.media.filter((m) => m.type === 'image').map((m) => m.src);
