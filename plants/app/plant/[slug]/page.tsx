import fs from 'fs';
import path from 'path';

interface PlantData {
  name: string;
  description: string;
  benefits?: string;
  culinaryUses?: string;
  medicinalUses?: string;
  // Add more fields as needed
}

export default async function PlantPage({ params, }: { params: { slug: string } }) {
  const plant = getPlantData(params.slug);

  if (!plant) {
    return (
      <div className="text-center text-red-600">
        <h1 className="text-2xl font-bold">Plant not found</h1>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-green-800">{plant.name}</h1>
      <p>{plant.description}</p>

      {plant.benefits && (
        <section>
          <h2 className="text-xl font-semibold text-green-700">Benefits</h2>
          <p>{plant.benefits}</p>
        </section>
      )}

      {plant.culinaryUses && (
        <section>
          <h2 className="text-xl font-semibold text-green-700">Culinary Uses</h2>
          <p>{plant.culinaryUses}</p>
        </section>
      )}

      {plant.medicinalUses && (
        <section>
          <h2 className="text-xl font-semibold text-green-700">Medicinal Uses</h2>
          <p>{plant.medicinalUses}</p>
        </section>
      )}
    </div>
  );
}

function getPlantData(slug: string): PlantData | null {
  const plantsDir = path.join(process.cwd(), 'plants');
  console.log('plantsDir', plantsDir);
  // Search through all categories for the slug
  const categories = fs.readdirSync(plantsDir).filter(c => 
    fs.statSync(path.join(plantsDir, c)).isDirectory()
  );

  for (const category of categories) {
    const filePath = path.join(plantsDir, category, `${slug}.json`);
    console.log('filePath', filePath);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  }
  return null;
}

export async function generateStaticParams() {
  const fs = require('fs');
  const path = require('path');

  const plantsDir = path.join(process.cwd(), 'plants');
  const categories = fs.readdirSync(plantsDir).filter((c: string) =>
    fs.statSync(path.join(plantsDir, c)).isDirectory()
  );

  const slugs: { slug: string }[] = [];
  for (const category of categories) {
    const files = fs.readdirSync(path.join(plantsDir, category))
      .filter((f: string) => f.endsWith('.json'))
      .map((f: string) => ({
        slug: f.replace(/\.json$/, '')
      }));
    slugs.push(...files);
  }

  return slugs;
}
