"use client";

import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Assuming adminService.getProducts() exists or use productService
        const res = await adminService.getProducts();
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="admin-products p-6">
      <h1 className="text-3xl font-bold mb-4">Product Management</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}
