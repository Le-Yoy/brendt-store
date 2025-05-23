'use client';

import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { useEffect } from 'react';
import { checkApiEndpoints } from '@/utils/debug';

// Initialize the font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

// Metadata moved to separate file to support client components
export const metadata = {
  title: 'BRENDT - Premium Footwear',
  description: 'Shop the finest handcrafted shoes and boots',
};

export default function RootLayout({ children }) {
  // Run API endpoint checks in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      checkApiEndpoints();
    }
  }, []);
  
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}