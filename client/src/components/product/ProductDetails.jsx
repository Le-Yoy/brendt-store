import React, { useState } from 'react';
import styles from './ProductDetails.module.css';

const ProductDetails = ({ product }) => {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'care', label: 'Care Instructions' },
    { id: 'delivery', label: 'Delivery & Returns' }
  ];

  return (
    <div className={styles.productDetails}>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'details' && (
          <div className={styles.panel}>
            <h3 className={styles.subtitle}>Product Details</h3>
            <ul className={styles.list}>
              {product.details.map((detail, index) => (
                <li key={index} className={styles.listItem}>{detail}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'care' && (
          <div className={styles.panel}>
            <h3 className={styles.subtitle}>Care Instructions</h3>
            <p className={styles.text}>{product.care}</p>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className={styles.panel}>
            <h3 className={styles.subtitle}>Delivery</h3>
            <p className={styles.text}>
              Standard delivery (2-5 business days): Free for orders over €500, €20 for orders under €500.
            </p>
            <p className={styles.text}>
              Express delivery (1-2 business days): €35
            </p>
            
            <h3 className={styles.subtitle}>Returns</h3>
            <p className={styles.text}>
              Free returns within 30 days of delivery. Items must be unworn and in original packaging with tags attached.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;