import React, { useState } from 'react';
import styles from './CategorySidebar.module.css';

const CategorySidebar = ({ subcategories, selectedSubcategory, onSubcategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle mobile sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle subcategory selection
  const handleSubcategoryClick = (subcategoryId) => {
    if (selectedSubcategory === subcategoryId) {
      onSubcategoryChange(null); // Deselect if already selected
    } else {
      onSubcategoryChange(subcategoryId);
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button className={styles.mobileToggle} onClick={toggleSidebar}>
        Filtrer par catégorie
        <span className={`${styles.arrow} ${isOpen ? styles.arrowUp : ''}`}>
          &#9662;
        </span>
      </button>
      
      {/* Sidebar content */}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>Subcatégories</h3>
          
          <ul className={styles.subcategoryList}>
            <li className={styles.subcategoryItem}>
              <button 
                className={`${styles.subcategoryButton} ${!selectedSubcategory ? styles.selected : ''}`}
                onClick={() => onSubcategoryChange(null)}
              >
                Toutes les subcatégories
              </button>
            </li>
            
            {subcategories.map((subcategory) => (
              <li key={subcategory.id} className={styles.subcategoryItem}>
                <button 
                  className={`${styles.subcategoryButton} ${selectedSubcategory === subcategory.id ? styles.selected : ''}`}
                  onClick={() => handleSubcategoryClick(subcategory.id)}
                >
                  {subcategory.name}
                  <span className={styles.count}>({subcategory.count})</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;