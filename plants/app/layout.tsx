import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Plant Reference',
  description: 'A reference site for plants, herbs, veggies, and more.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-green-50 text-gray-800">
        <header className="bg-green-700 text-white shadow">
          <nav className="container mx-auto flex flex-wrap items-center justify-between p-4">
            <Link href="/" className="text-2xl font-bold">🌱 Plant Reference</Link>
            <div className="flex flex-wrap gap-4">
              <CategoryDropdown />
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-green-700 text-white text-center p-4 mt-8">
          &copy; {new Date().getFullYear()} Plant Reference
        </footer>
      </body>
    </html>
  );
}

function CategoryDropdown() {
  const categories = [
    { name: 'Fruit Trees', href: '/category/fruit-trees' },
    { name: 'Berries', href: '/category/berries' },
    { name: 'Leafy Greens', href: '/category/leafy-greens' },
    { name: 'Ground Veggies', href: '/category/ground-veggies' },
    { name: 'Nightshades', href: '/category/nightshades' },
    { name: 'Medicinal Herbs', href: '/category/medicinal-herbs' },
    { name: 'Culinary Herbs', href: '/category/culinary-herbs' }
  ];

  return (
    <div className="relative group">
      <button className="hover:underline">Categories ▼</button>
      <div className="absolute hidden group-hover:block bg-white text-gray-800 rounded shadow mt-2 min-w-max z-10">
        {categories.map(cat => (
          <Link
            key={cat.name}
            href={cat.href}
            className="block px-4 py-2 hover:bg-green-100"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
