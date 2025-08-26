import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bug Capture Mockup App',
  description: 'A comprehensive bug capture and testing platform for cross-browser testing and issue reporting',
  keywords: ['Bug Capture', 'Testing', 'Cross-browser', 'Issue Reporting', 'Jira Integration'],
  authors: [{ name: 'Bug Capture Team' }],
  creator: 'Bug Capture Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Bug Capture Mockup App',
    description: 'A comprehensive bug capture and testing platform for cross-browser testing and issue reporting',
    siteName: 'Bug Capture Mockup App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bug Capture Mockup App',
    description: 'A comprehensive bug capture and testing platform for cross-browser testing and issue reporting',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
