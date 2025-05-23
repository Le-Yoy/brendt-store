import React from 'react';

export default function UserTable({ users }) {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td className="border p-2">{user._id}</td>
            <td className="border p-2">{user.name}</td>
            <td className="border p-2">{user.email}</td>
            <td className="border p-2">{user.role}</td>
            <td className="border p-2">
              <button className="bg-blue-500 text-white p-1 mr-2">Edit</button>
              <button className="bg-red-500 text-white p-1">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
