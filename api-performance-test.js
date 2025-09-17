const https = require('https');

const endpoints = [
  '/api/products?limit=10',
  '/api/products/categories',
  '/api/products?gender=homme&limit=5'
];

async function testEndpoint(path) {
  const start = Date.now();
  return new Promise((resolve) => {
    https.get(`https://brendt-store-production-d6ef.up.railway.app${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const time = Date.now() - start;
        console.log(`${path}: ${time}ms - Status: ${res.statusCode}`);
        resolve(time);
      });
    }).on('error', console.error);
  });
}

async function runTests() {
  console.log('Testing API Performance...\n');
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
}

runTests();
