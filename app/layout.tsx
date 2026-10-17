import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'D-CHSS | Dengue Hematological Signature Predictor',
  description:
    'CBC (Complete Blood Count) ভ্যালু দিয়ে Dengue হওয়ার সম্ভাবনা (probability) ও ঝুঁকির মাত্রা জানুন। Research demonstration only - NOT a medical diagnosis tool.',
  keywords: [
    'dengue',
    'dengue prediction',
    'CBC',
    'hematology',
    'D-CHSS',
    'machine learning',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <AuthProvider>
          <DataProvider>
            <div className="flex min-h-screen flex-col overflow-x-hidden">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
