import React, { useState } from 'react';
import './ProductDetails.css';

const ProductDetails = ({ product }) => {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'care', label: 'Care Instructions' },
    { id: 'delivery', label: 'Delivery & Returns' }
  ];

  return (
    <div className="product-details">
      <div className="product-details__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`product-details__tab ${
              activeTab === tab.id ? 'product-details__tab--active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="product-details__content">
        {activeTab === 'details' && (
          <div className="product-details__panel">
            <h3 className="product-details__subtitle">Product Details</h3>
            <ul className="product-details__list">
              {product.details.map((detail, index) => (
                <li key={index} className="product-details__list-item">{detail}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="product-details__panel">
            <h3 className="product-details__subtitle">Care Instructions</h3>
            <p className="product-details__text">{product.care}</p>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="product-details__panel">
            <h3 className="product-details__subtitle">Delivery</h3>
            <p className="product-details__text">
              Standard delivery (2-5 business days): Free for orders over €500, €20 for orders under €500.
            </p>
            <p className="product-details__text">
              Express delivery (1-2 business days): €35
            </p>
            
            <h3 className="product-details__subtitle">Returns</h3>
            <p className="product-details__text">
              Free returns within 30 days of delivery. Items must be unworn and in original packaging with tags attached.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;