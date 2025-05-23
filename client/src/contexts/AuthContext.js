// src/contexts/AuthContext.js
// This file serves as a bridge to maintain backward compatibility
// We're re-exporting the auth components from hooks/useAuth.js

import { useAuth, AuthProvider } from '../hooks/useAuth';

export { useAuth, AuthProvider };
export default useAuth;