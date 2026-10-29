// Chukka Grainé media (static assets), shared by the /chukka landing page and
// the Chukka product page. Each color lists its media in display order:
// always open on the clearest asset (studio photo, or the video for Bleu).
export const CHUKKA_NAME = 'chukka grainé';

const IMG = '/assets/images/products/brendt-new/Homme/chaussures/boots/Chukka-Graine';
const VID = '/assets/videos/chukka';

const photo = (folder, n) => ({ type: 'image', src: `${IMG}/${folder}/${n}.webp` });
const video = (name) => ({
  type: 'video',
  src: `${VID}/${name}.mp4`,
  poster: `${VID}/${name}-poster.webp`,
});

export const COLLECTION_VIDEO = video('collection');

export const CHUKKA_COLORS = [
  {
    name: 'Noir',
    folder: 'Noir',
    swatch: '#111111',
    video: video('noir'),
    media: [photo('Noir', 1), video('noir'), photo('Noir', 2), photo('Noir', 3), photo('Noir', 4), photo('Noir', 5)],
  },
  {
    name: 'Bleu Navy',
    folder: 'Bleu-Navy',
    swatch: '#1f2a44',
    video: video('bleu-navy'),
    media: [photo('Bleu-Navy', 1), video('bleu-navy'), photo('Bleu-Navy', 2), photo('Bleu-Navy', 3), photo('Bleu-Navy', 4)],
  },
  {
    name: 'Marron',
    folder: 'Marron',
    swatch: '#4a3226',
    video: video('marron'),
    media: [photo('Marron', 1), video('marron'), photo('Marron', 2), photo('Marron', 3), photo('Marron', 4)],
  },
  {
    name: 'Bleu',
    folder: 'Bleu',
    swatch: '#2f5f9e',
    video: video('bleu'),
    media: [video('bleu'), photo('Bleu', 1), photo('Bleu', 2), photo('Bleu', 3), photo('Bleu', 4)],
  },
];

export const isChukka = (product) =>
  (product?.name || '').toLowerCase() === CHUKKA_NAME;

export const chukkaColor = (name) =>
  CHUKKA_COLORS.find((c) => c.name === name) || CHUKKA_COLORS[0];
