"use client";

import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import InventoryLogList from '../../components/admin/InventoryLogList';

export default function AdminInventoryPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await adminService.getInventoryLogs();
        setLogs(res.data.logs);
      } catch (error) {
        console.error("Error fetching inventory logs:", error);
      }
    }
    fetchInventory();
  }, []);

  return (
    <div className="admin-inventory p-6">
      <h1 className="text-3xl font-bold mb-4">Inventory Approvals</h1>
      <InventoryLogList logs={logs} />
    </div>
  );
}
