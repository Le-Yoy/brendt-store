// src/app/test-api/page.jsx
'use client';

import React, { useState } from 'react';
import { userService, addressService, orderService } from '../../services';

export default function TestAPI() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await userService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      setResult(response);
      setError(null);
    } catch (err) {
      setError(err.message || 'Login failed');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Add more test functions for other API services

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Testing</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testLogin} disabled={loading}>
          Test Login
        </button>
        {/* Add more test buttons */}
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {result && (
        <div>
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}