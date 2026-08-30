'use client';

import React, { useState } from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { RequestModal } from '@/components/RequestModal';
import { AuthModal } from '@/components/AuthModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>3DOM Multi-Vertical E-Commerce | 3D Printing, Korean Fashion & Beauty</title>
        <meta name="description" content="3DOM multi-vertical storefront platform unifying 3D printing equipment, GenZ Korean fashion, and luxury beauty into one shopping cart." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-zinc-950 text-slate-900">
        <AuthProvider>
          <CartProvider>
            <Header onRequestModalOpen={() => setIsRequestModalOpen(true)} />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <RequestModal
              isOpen={isRequestModalOpen}
              onClose={() => setIsRequestModalOpen(false)}
            />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
