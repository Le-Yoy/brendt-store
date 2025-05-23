import React from 'react';

export default function FormList({ forms }) {
  return (
    <div>
      {forms.map((form) => (
        <div key={form._id} className="border p-4 my-2">
          <p><strong>Type:</strong> {form.type}</p>
          <p><strong>Status:</strong> {form.status}</p>
          <p><strong>Data:</strong> {JSON.stringify(form.data)}</p>
          <div className="mt-2">
            <button className="bg-blue-500 text-white p-1 mr-2">View</button>
            <button className="bg-green-500 text-white p-1">Update</button>
          </div>
        </div>
      ))}
    </div>
  );
}
