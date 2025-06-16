import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function HomePage() {
  const categories = getCategories();

  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-extrabold text-green-800">🌿 Welcome to the Plant Reference</h1>
      <p className="text-lg text-gray-700">
        Explore a wide variety of plants, herbs, vegetables, and trees. Learn about their benefits,
        uses, and how they contribute to a healthy garden.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map(category => (
          <Link
            key={category}
            href={`/category/${category}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {formatCategoryName(category)}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Reads /plants/ directory at build time
function getCategories(): string[] {
  const plantsDir = path.join(process.cwd(), 'plants');
  const entries = fs.readdirSync(plantsDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

// Formats slug-like folder names into nice titles
function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}
