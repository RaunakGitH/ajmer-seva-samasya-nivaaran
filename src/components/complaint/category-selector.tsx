
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Trash, Droplet, Lightbulb, Building, Trees, AlertTriangle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  selectedCategoryId: string | null;
}

export function CategorySelector({ onSelect, selectedCategoryId }: CategorySelectorProps) {
  const categories: Category[] = [
    {
      id: 'road',
      name: 'Road',
      icon: <MapPin className="h-10 w-10" />,
      description: 'Potholes, damaged roads, traffic issues',
    },
    {
      id: 'garbage',
      name: 'Garbage',
      icon: <Trash className="h-10 w-10" />,
      description: 'Waste collection, dumping issues, cleanliness',
    },
    {
      id: 'water',
      name: 'Water',
      icon: <Droplet className="h-10 w-10" />,
      description: 'Water supply, leakage, quality issues',
    },
    {
      id: 'electricity',
      name: 'Electricity',
      icon: <Lightbulb className="h-10 w-10" />,
      description: 'Power outages, street lights, electrical hazards',
    },
    {
      id: 'property',
      name: 'Property',
      icon: <Building className="h-10 w-10" />,
      description: 'Illegal construction, encroachment, property disputes',
    },
    {
      id: 'environment',
      name: 'Environment',
      icon: <Trees className="h-10 w-10" />,
      description: 'Air pollution, noise pollution, tree cutting',
    },
    {
      id: 'other',
      name: 'Other',
      icon: <AlertTriangle className="h-10 w-10" />,
      description: 'Other civic issues not listed above',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card 
          key={category.id}
          className={`cursor-pointer transition-all ${
            selectedCategoryId === category.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
          }`}
          onClick={() => onSelect(category)}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className={`p-3 rounded-full mb-4 ${
              selectedCategoryId === category.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
            }`}>
              {category.icon}
            </div>
            <h3 className="text-lg font-medium mb-2">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
