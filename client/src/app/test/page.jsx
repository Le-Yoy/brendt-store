'use client';
import { useEffect, useState } from 'react';
import productService from '@/services/productService';

export default function TestPage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    async function fetchProducts() {
      const result = await productService.getProducts({ limit: 100 });
      const productData = result.data?.data || result.data || result || [];
      setProducts(productData);
    }
    fetchProducts();
  }, []);
  
  return (
    <div style={{padding: '20px'}}>
      <h1>Product Test</h1>
      {products.map(product => (
        <div key={product._id || product.id} style={{margin: '10px 0', padding: '10px', border: '1px solid #ccc'}}>
          <p><strong>ID:</strong> {product._id || product.id}</p>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Subcategory:</strong> {product.subcategory}</p>
        </div>
      ))}
    </div>
  );
}