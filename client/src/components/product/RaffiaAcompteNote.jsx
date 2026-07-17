'use client';

import { useRegion } from '@/contexts/RegionContext';
import styles from './RaffiaAcompteNote.module.css';

// Morocco-only "collection VIP / avance" note, shown ONLY on raffia products
// (Tarhazout, Anchor Point, any raffia). Pre-frames the deposit as an
// exclusivity/reservation step so it isn't a surprise on WhatsApp later.
const WHATSAPP = 'https://wa.me/33773436514';

export default function RaffiaAcompteNote({ product }) {
  const { isMorocco } = useRegion();

  if (!product || !isMorocco) return null;

  const name = product.name || '';
  const materials = product.materials || [];
  const colors = product.colors || [];
  const isRaffia =
    /tarhazout|anchor\s*point/i.test(name) ||
    materials.some((m) => /raffia/i.test(m)) ||
    colors.some((c) => /raffia/i.test(c?.name || ''));

  if (!isRaffia) return null;

  const waText = encodeURIComponent(
    `Salam, je souhaite réserver une paire ${name} (collection VIP raffia). ` +
      `Pouvez-vous me confirmer la disponibilité et l'avance ?`
  );

  return (
    <div className={styles.acompte}>
      <span className={styles.badge}>Collection VIP · sur commande</span>
      <p className={styles.text}>
        Le <strong>{name}</strong> est confectionné à la main, sur commande. Une petite{' '}
        <strong>avance par virement</strong> réserve votre paire et lance sa confection —
        prête sous <strong>1 à 2 jours</strong>. Le reste se règle à la livraison.
      </p>
      <a
        className={styles.cta}
        href={`${WHATSAPP}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Réserver ma paire sur WhatsApp
      </a>
    </div>
  );
}
