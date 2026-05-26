import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { BottomNav } from '@/components/navbar/BottomNav';
import { NotificationsListener } from '@/components/NotificationsListener';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MALZZ NOKOS',
  description: 'Platform nomor virtual OTP otomatis tercepat dan termurah.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'MALZZ NOKOS',
    description: 'Platform nomor virtual OTP otomatis tercepat dan termurah.',
    url: 'https://malzz-nokos.vercel.app',
    siteName: 'MALZZ NOKOS',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} pb-24 relative overflow-x-hidden`}>
        <div className="flex flex-col min-h-screen bg-bg">
          <main className="flex-grow p-4">{children}</main>
        </div>
        <BottomNav />
        <Toaster position="top-center" />
        <NotificationsListener />
      </body>
    </html>
  );
}
