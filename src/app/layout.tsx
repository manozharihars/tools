import type { Metadata } from 'next';
import './global.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    default: 'CloudToolbox - High Performance File Utilities & Converters',
    template: '%s | CloudToolbox'
  },
  description: 'Convert PNG to JPG, protect PDF files, convert videos to high-quality GIFs, and convert PDF documents to Microsoft Word (DOCX) online for free. Next-generation local-first utility platform.',
  keywords: ['PDF converter', 'Image utility', 'Video to GIF', 'File processing tools', 'Local-first cloud tools'],
  authors: [{ name: 'CloudToolbox Team' }],
  metadataBase: new URL('https://multitoolplatform.example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://multitoolplatform.example.com',
    title: 'CloudToolbox - High Performance File Utilities & Converters',
    description: 'Next-generation file processing. Secure, high-performance, and local-first utilities for PDF, Images, and Video.',
    siteName: 'CloudToolbox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CloudToolbox - High Performance File Utilities',
    description: 'Next-generation file processing. Secure, high-performance, and local-first utilities.',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 glass-panel border-b border-white/5 bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-400">
                CloudToolbox
              </Link>
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
                <Link href="/pdf" className="hover:text-white transition">PDF Utilities</Link>
                <Link href="/image" className="hover:text-white transition">Image Utilities</Link>
                <Link href="/video/convert-video-to-gif" className="hover:text-white transition">Video Converter</Link>
              </nav>
            </div>
            <div>
              <span className="text-xs font-semibold text-violet-400/80 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full">
                ⚡ Local & Cloud Hybrid Engine
              </span>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </main>

        <footer className="glass-panel border-t border-white/5 bg-slate-950/80 mt-12 py-12 text-slate-400 text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-lg font-bold text-white">CloudToolbox</div>
              <p className="text-xs text-slate-500">
                A highly optimized, server-less oriented utility platform built for high-performance operations and privacy.
              </p>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">PDF Services</div>
              <ul className="space-y-2 text-xs">
                <li><Link href="/pdf" className="hover:text-violet-400">All PDF Tools</Link></li>
                <li><Link href="/pdf/protect-pdf-with-password" className="hover:text-violet-400">Protect PDF with Password</Link></li>
                <li><Link href="/pdf/convert-pdf-to-word" className="hover:text-violet-400">Convert PDF to Word DOCX</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">Image Services</div>
              <ul className="space-y-2 text-xs">
                <li><Link href="/image" className="hover:text-violet-400">All Image Tools</Link></li>
                <li><Link href="/image/convert-png-to-jpg" className="hover:text-violet-400">Convert PNG to JPG / WebP</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-white mb-4">Video Services</div>
              <ul className="space-y-2 text-xs">
                <li><Link href="/video/convert-video-to-gif" className="hover:text-violet-400">Convert Video to GIF</Link></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} CloudToolbox. All rights reserved. Locally processed files never touch our servers.
          </div>
        </footer>
      </body>
    </html>
  );
}
