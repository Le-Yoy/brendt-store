// Brendtford media (static assets) for the /brendtford landing page.
// The product page uses the same photos, stored in the DB in this order:
// AI side view → real photos → AI worn → AI pair.
const IMG = '/assets/images/products/brendt-new/Homme/chaussures/sneaker/Brendtford';

export const BRENDTFORD_NAME = 'brendtford';

export const HERO_VIDEO = {
  type: 'video',
  src: '/assets/videos/brendtford/noir.mp4',
  poster: '/assets/videos/brendtford/noir-poster.webp',
};

const photos = (folder, reals) =>
  ['profile', ...reals, 'worn', 'pair'].map((name) => `${IMG}/${folder}/${name}.webp`);

export const BRENDTFORD_COLORS = [
  { name: 'Noir', folder: 'Noir', swatch: '#111111', pair: `${IMG}/Noir/pair.webp`, photos: photos('Noir', ['real-1', 'real-2']) },
  { name: 'Marron', folder: 'Marron', swatch: '#8a4b24', pair: `${IMG}/Marron/pair.webp`, photos: photos('Marron', ['real-1', 'real-2']) },
  { name: 'Bleu', folder: 'Bleu', swatch: '#1f3a8a', pair: `${IMG}/Bleu/pair.webp`, photos: photos('Bleu', ['real-1', 'real-2', 'real-3']) },
];

export const isBrendtford = (product) =>
  (product?.name || '').toLowerCase() === BRENDTFORD_NAME;
