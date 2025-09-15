// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';
import { AuthProvider } from '@/hooks/useAuth'; // ADDED: Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Brendt Store',
  description: 'Your premium online store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}