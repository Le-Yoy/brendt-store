'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoryGrid.module.css';

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: 'BOOTS',
      image: '/assets/images/section-3/1.jpg',
      link: '/category/chaussures?subcategory=boots',
      className: styles.boots
    },
    {
      id: 2,
      name: 'SNEAKERS',
      image: '/assets/images/section-3/2.png',
      link: '/category/chaussures?subcategory=sneakers',
      className: styles.sneakers
    },
    {
      id: 3,
      name: 'DERBIES',
      image: '/assets/images/section-3/3.jpg',
      link: '/category/chaussures?subcategory=derbies',
      className: styles.derbies
    },
    {
      id: 4,
      name: 'MOCASSINS',
      image: '/assets/images/section-3/4.jpg',
      link: '/category/chaussures?subcategory=mocassins',
      className: styles.mocassins
    },
    {
      id: 5,
      name: 'BOUCLES',
      image: '/assets/images/section-3/5.jpg',
      link: '/category/chaussures?subcategory=derbies',
      className: styles.boucles
    }
  ];

  return (
    <section className={styles.categoryGridSection}>
      <div className={styles.container}>
        <div className={styles.divider}></div>
        <p className={styles.quote}>
          Des collections intemporelles conçues pour s'adapter à tous les styles, du classique au contemporain.
        </p>
        
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link 
              href={category.link} 
              key={category.id} 
              className={`${styles.categoryItem} ${category.className}`}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.categoryImage}
                  priority={category.id === 1}
                />
                <div className={styles.overlay}>
                  <h3 className={styles.categoryTitle}>{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;