import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import NavbarAuth from '../components/NavbarAuth';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'SourceMe - Your Personal Sourcing Concierge',
  description: 'AI-powered sourcing platform that finds exactly what you need.',
};

function Navbar() {
  return (
    <nav className="luxury-glass dark:luxury-glass-dark border-b border-stone-200/30 dark:border-stone-700/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-luxury-bronze rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <span className="text-white font-light text-lg">S</span>
              </div>
              <span className="font-light text-2xl text-luxury-bronze tracking-wide">
                SourceMe
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-neutral-600 dark:text-neutral-300 hover:text-stone-600 dark:hover:text-stone-400 font-light transition-colors tracking-wide">
              Home
            </Link>
            <Link href="/about" className="text-neutral-600 dark:text-neutral-300 hover:text-stone-600 dark:hover:text-stone-400 font-light transition-colors tracking-wide">
              Experience
            </Link>
          </div>
          
          <div className="flex items-center">
            <NavbarAuth />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" suppressHydrationWarning={true}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-stone-50 dark:from-black dark:via-neutral-900 dark:to-stone-900">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}