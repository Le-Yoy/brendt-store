// src/components/product/ProductNotFound.jsx
import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button/Button';
// Remove the incorrect import and use inline styles or create a module.css file here

const ProductNotFound = ({ message }) => {
  return (
    <div className="product-not-found">
      <div className="product-not-found__container">
        <h1 className="product-not-found__title">Product Not Found</h1>
        <p className="product-not-found__message">
          {message || "We couldn't find the product you're looking for."}
        </p>
        <div className="product-not-found__actions">
          <Link href="/categories">
            <Button variant="primary" size="medium">
              Browse Collections
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="medium">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductNotFound;