'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './PromoFeatures.module.css';

const PromoFeatures = () => {
  const features = [
    {
      id: 1,
      title: 'Livraison offerte',
      image: '/assets/images/section-5/1.avif',
      link: '/faq?category=emballage-expedition' // Updated to link to shipping FAQ
    },
    {
      id: 2,
      title: 'Retours et échanges sans frais',
      image: '/assets/images/section-5/2.avif',
      link: '/faq?category=retours-echanges' // Updated to link to returns FAQ
    },
    {
      id: 3,
      title: 'Lisez notre univers',
      image: '/assets/images/section-5/3.avif',
      link: '/faq?category=achat-produits' // Updated to link to general info FAQ
    }
  ];

  return (
    <section className={styles.promoFeatures}>
      <h2 className={styles.sectionTitle}>Services</h2>
      
      <div className={styles.container}>
        {features.map((feature, index) => (
          <React.Fragment key={feature.id}>
            <div className={styles.featureItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 33vw, 100vw"
                  className={styles.featureImage}
                />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <Link href={feature.link} className={styles.discoverButton}>
                <span className={styles.dashLeft}>-</span>
                <span>Découvrir</span>
                <span className={styles.dashRight}>-</span>
              </Link>
              <Link href={feature.link} className={styles.mobileArrow}>
                <span className={styles.arrowTip}></span>
              </Link>
            </div>
            
            {index < features.length - 1 && (
              <div className={styles.divider}>
                <div className={styles.dividerLine}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default PromoFeatures;