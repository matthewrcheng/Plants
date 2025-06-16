import fs from 'fs';
import path from 'path';
import Link from 'next/link';

interface PlantMeta {
  name: string;
  slug: string;
}

export default async function CategoryPage({ params, }: { params: { category: string } }) {
  const plants = getPlants(params.category);

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-3xl font-bold text-green-800">
        🌿 {formatCategoryName(params.category)}
      </h1>
      {plants.length === 0 ? (
        <p className="text-gray-600">No plants found in this category.</p>
      ) : (
        <ul className="flex flex-wrap justify-center gap-4">
          {plants.map(plant => (
            <li key={plant.slug}>
              <Link
                href={`/plant/${plant.slug}`}
                className="block bg-green-100 rounded-lg p-4 shadow hover:bg-green-200 transition"
              >
                {plant.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getPlants(category: string): PlantMeta[] {
  const categoryDir = path.join(process.cwd(), 'plants', category);
  if (!fs.existsSync(categoryDir)) return [];

  const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const data = JSON.parse(
      fs.readFileSync(path.join(categoryDir, file), 'utf8')
    );
    return {
      name: data.name || file.replace('.json', ''),
      slug: file.replace('.json', '')
    };
  });
}

function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateStaticParams() {
  const fs = require('fs');
  const path = require('path');

  const plantsDir = path.join(process.cwd(), 'plants');
  const categories = fs.readdirSync(plantsDir).filter((c: string) =>
    fs.statSync(path.join(plantsDir, c)).isDirectory()
  );

  return categories.map((category: string) => ({
    category
  }));
}
