import fs from 'fs';
import path from 'path';
import { use } from 'react';
import React from 'react';

export interface PlantData {
  name: string;
  slug: string;
  category: string;
  description?: string;
  growing?: {
    zone?: string;
    sun?: string;
    water?: string;
    soil?: string;
  };
  planting?: {
    height?: string;
    spacing?: string;
    whenToPlant?: string;
    propagation?: string;
    depth?: string;
    companion?: string[];
    avoidPlantingNear?: string[];
  };
  careAndMaintenance?: {
    pruning?: string;
    stakingOrSupport?: string;
    overwintering?: string;
    general?: string;
  };
  harvestingAndUsage?: {
    whenToHarvest?: string;
    howToHarvest?: string;
    varieties?: any;
    preservation?: string;
    edibleOrToxic?: string;
    culinary?: string;
    medicinal?: object;
    aromatic?: string;
  };
  ecologicalInfo?: {
    pollinators?: string;
    wildlifeResistance?: string;
    nitrogenFixer?: string;
  };
}

type Params = Promise<{ slug: string }>;

export default function PlantPage(props: { params: Params }) {
  const params = use(props.params);
  const slug = params.slug;
  const plant = getPlantData(slug);

  if (!plant) {
    return (
      <div className="text-center text-red-600 p-8">
        <h1 className="text-2xl font-bold">Plant not found</h1>
      </div>
    );
  }

  const renderSection = (title: string, data: Record<string, any> | undefined) => {
    if (!data) return null;
    const entries = Object.entries(data).filter(([, v]) => v);
    if (entries.length === 0) return null;

    return (
      <section className="bg-green-50 rounded-xl shadow p-4 space-y-2">
        <h2 className="text-2xl font-semibold text-green-700">{title}</h2>
        <ul className="list-disc ml-6 text-green-900">
        {entries.map(([key, value]) => (
          <li key={key}>
            <span className="font-medium">{getIcon(key)} {formatLabel(key)}:</span>{' '}
            {typeof value === 'string'
              ? value
              : (
                <ul className="list-circle ml-4">
                  {Object.entries(value as Record<string, string>).map(([subKey, subVal]) => (
                    <li key={subKey}>
                      <span className="font-medium">{formatLabel(subKey)}:</span> {subVal}
                    </li>
                  ))}
                </ul>
              )
            }
          </li>
        ))}
        </ul>
      </section>
    );
  };

  const formatLabel = (key: string) =>
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase());

  const getIcon = (key: string): string => {
    const map: Record<string, string> = {
      sun: '🌞',
      water: '💧',
      soil: '🌱',
      zone: '📍',
      spacing: '📏',
      height: '📏',
      whenToPlant: '📅',
      propagation: '🌱',
      depth: '⬇️',
      pruning: '✂️',
      stakingOrSupport: '🪢',
      overwintering: '❄️',
      whenToHarvest: '⏰',
      howToHarvest: '✋',
      preservation: '🥫',
      edibleOrToxic: '⚠️',
      culinary: '🍴',
      medicinal: '💊',
      aromatic: '🌸',
      companion: '🤝',
      avoidPlantingNear: '🚫',
      pollinators: '🐝',
      wildlifeResistance: '🦌',
      nitrogenFixer: '🌿'
    };
    return map[key] || '';
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-green-800">{plant.name}</h1>
      <p className="italic text-gray-600">Category: {plant.category}</p>
      {plant.description && <p className="text-green-900">{plant.description}</p>}

      {renderSection('Growing', plant.growing)}
      {renderSection('Planting', plant.planting)}
      {renderSection('Care & Maintenance', plant.careAndMaintenance)}
      {renderSection('Harvesting & Usage', plant.harvestingAndUsage)}
      {renderSection('Ecological Info', plant.ecologicalInfo)}
    </div>
  );
}

function getPlantData(slug: string): PlantData | null {
  const plantsDir = path.join(process.cwd(), 'plants');
  const categories = fs.readdirSync(plantsDir).filter(c =>
    fs.statSync(path.join(plantsDir, c)).isDirectory()
  );

  for (const category of categories) {
    const filePath = path.join(plantsDir, category, `${slug}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  }
  return null;
}

export async function generateStaticParams() {
  const plantsDir = path.join(process.cwd(), 'plants');
  const categories = fs.readdirSync(plantsDir).filter(c =>
    fs.statSync(path.join(plantsDir, c)).isDirectory()
  );

  const slugs: { slug: string }[] = [];
  for (const category of categories) {
    const files = fs
      .readdirSync(path.join(plantsDir, category))
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({
        slug: f.replace(/\.json$/, '')
      }));
    slugs.push(...files);
  }

  return slugs;
}
