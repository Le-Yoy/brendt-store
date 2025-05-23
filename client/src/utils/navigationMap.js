// src/utils/navigationMap.js
// This file serves as a reference to ensure all navigation links are valid

export const accountPages = {
    dashboard: '/account',
    orders: '/account/orders',
    orderDetail: (id) => `/account/orders/${id}`,
    profile: '/account/profile',
    addresses: '/account/addresses',
  };
  
  export const mainNavigation = {
    home: '/',
    homme: '/homme',
    femme: '/femme',
    cadeaux: '/cadeaux-pour-lui',
    savoirFaire: '/savoir-faire',
    textile: '/textile-universe',
  };
  
  export const userPages = {
    login: '/login',
    register: '/register',
    forgotPassword: '/mot-de-passe-oublie',
  };