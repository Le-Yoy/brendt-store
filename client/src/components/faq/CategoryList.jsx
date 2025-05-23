import React from 'react';
import styles from './CategoryList.module.css';

const CategoryList = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className={styles.categoryList}>
      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.id} className={styles.listItem}>
            <button
              className={`${styles.categoryButton} ${
                activeCategory === category.id ? styles.active : ''
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;