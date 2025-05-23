import React from 'react';

export default function OrderList({ orders }) {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">Order ID</th>
          <th className="border p-2">Customer</th>
          <th className="border p-2">Total</th>
          <th className="border p-2">Status</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td className="border p-2">{order._id}</td>
            <td className="border p-2">{order.user ? order.user.name : 'N/A'}</td>
            <td className="border p-2">{order.totalPrice}</td>
            <td className="border p-2">
              {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
            </td>
            <td className="border p-2">
              <button className="bg-blue-500 text-white p-1 mr-2">View</button>
              <button className="bg-green-500 text-white p-1">Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
