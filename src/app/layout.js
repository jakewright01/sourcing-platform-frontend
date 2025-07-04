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
    <nav className="navbar-clean dark:navbar-clean-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white dark:text-black font-medium text-sm">S</span>
              </div>
              <span className="font-normal text-xl text-black dark:text-white tracking-tight">
                SourceMe
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-normal transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-normal transition-colors">
              How it Works
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
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}