import React from 'react';

export default function InventoryLogList({ logs }) {
  return (
    <div>
      {logs.map((log) => (
        <div key={log._id} className="border p-4 my-2">
          <p><strong>Product:</strong> {log.product}</p>
          <p><strong>Requested Quantity:</strong> {log.requestedQuantity}</p>
          <p><strong>Status:</strong> {log.status}</p>
          <p><strong>Requested By:</strong> {log.requestedBy}</p>
          <div className="mt-2">
            <button className="bg-green-500 text-white p-1 mr-2">Approve</button>
            <button className="bg-red-500 text-white p-1">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
