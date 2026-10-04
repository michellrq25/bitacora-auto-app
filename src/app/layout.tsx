import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/frontend/components/layout/bottom-nav';
import { ThemeProvider } from '@/frontend/components/layout/theme-provider';

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
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('bitacora_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-950 shadow-2xl relative">
            <div className="flex-1 flex flex-col page-transition">
              {children}
            </div>
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
