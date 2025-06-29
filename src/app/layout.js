// File: src/app/layout.js (Updated with new font)

// We are importing 'Poppins' instead of 'Inter'
import { Poppins } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import NavbarAuth from '../components/NavbarAuth';

// Configure the new font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'] // We'll load a few font weights
});

export const metadata = {
  title: 'SourceMe', // Updated title
  description: 'Your personal sourcing concierge.',
};

function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="flex items-center py-4 px-2">
              <span className="font-bold text-gray-800 text-2xl tracking-tighter">SourceMe</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {/* We can add more links here later */}
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <NavbarAuth />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      {/* We apply the new font's class name to the body */}
      <body className={poppins.className}>
        <Navbar />
        <div className="bg-gray-100">
          {children}
        </div>
      </body>
    </html>
  );
}