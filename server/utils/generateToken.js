const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Hardcoded JWT secret as fallback for Railway deployment issues
  const jwtSecret = process.env.JWT_SECRET || 'brendt_store_2024_super_secret_jwt_key_production_railway_deployment_secure_token_generation';
  
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;