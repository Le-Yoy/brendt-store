"use client";

import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import OrderList from '../../components/admin/OrderList';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await adminService.getAllOrders();
        setOrders(res);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="admin-orders p-6">
      <h1 className="text-3xl font-bold mb-4">Order Management</h1>
      <OrderList orders={orders} />
    </div>
  );
}
