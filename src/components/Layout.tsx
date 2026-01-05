import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <Navbar />
      <main className="p-4 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
