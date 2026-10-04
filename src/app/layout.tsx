import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/frontend/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: 'Bitácora Auto Perú | Control Vehicular & SOAT',
  description:
    'MVP Mobile-First para control integral de vehículos en Perú: vencimiento de SOAT, Revisión Técnica (CITV), Brevete MTC, lubricantes y alertas automáticas a Telegram.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-white">
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-950 shadow-2xl relative">
          <div className="flex-1 flex flex-col page-transition">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
