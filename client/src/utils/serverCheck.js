// src/utils/serverCheck.js
export const checkServerStatus = async () => {
    try {
      console.log('[SERVER CHECK] Attempting to connect to API...');
      const response = await fetch('http://localhost:5001/api/test');
      
      // Log detailed information about the response
      console.log('[SERVER CHECK] Response status:', response.status, response.statusText);
      
      let data;
      try {
        data = await response.json();
        console.log('[SERVER CHECK] Response data:', data);
      } catch (error) {
        console.error('[SERVER CHECK] Failed to parse JSON response:', error);
        data = { message: 'Invalid response format' };
      }
      
      // Update UI status indicator
      const statusEl = document.getElementById('server-status');
      if (statusEl) {
        if (response.ok) {
          statusEl.textContent = 'Connected';
          statusEl.style.color = 'green';
        } else {
          statusEl.textContent = `Error (${response.status})`;
          statusEl.style.color = 'red';
        }
      }
      
      // Additional detailed logging
      if (!response.ok) {
        console.error('[SERVER CHECK] API connection failed with status:', response.status);
      } else {
        console.log('[SERVER CHECK] API connection successful');
      }
      
      return response.ok;
    } catch (error) {
      // Detailed error logging
      console.error('[SERVER CHECK] Server connection failed:', error.message);
      console.error('[SERVER CHECK] Is the server running at http://localhost:5001?');
      
      // Update UI status indicator
      const statusEl = document.getElementById('server-status');
      if (statusEl) {
        statusEl.textContent = 'Disconnected';
        statusEl.style.color = 'red';
      }
      
      return false;
    }
  };