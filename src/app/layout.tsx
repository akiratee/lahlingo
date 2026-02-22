import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LahLingo - Learn Singapore Dialects',
  description: 'Master Hokkien, Teochew, Cantonese & Hakka with tone training. Reclaim your heritage!',
  manifest: '/manifest.json',
  themeColor: '#8B5E3C',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LahLingo',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
