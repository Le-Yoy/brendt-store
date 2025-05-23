const jwt = require('jsonwebtoken');

const generateToken = (userId, userRole) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables');
    throw new Error('JWT configuration error');
  }
  
  // Log the JWT secret length for debugging
  console.log(`Using JWT secret with length: ${secret.length}`);
  
  return jwt.sign(
    { id: userId, role: userRole },
    secret,
    { expiresIn: '30d' }
  );
};

module.exports = generateToken;