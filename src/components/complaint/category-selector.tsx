
import { MapPin, Trash, Droplet, Lightbulb, Building, Trees, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card 
          key={category.id}
          className={`cursor-pointer transition-all duration-300 border-0 hover:shadow-lg group overflow-hidden ${
            selectedCategoryId === category.id 
              ? 'ring-2 ring-primary shadow-md shadow-primary/10' 
              : 'hover:shadow-primary/5 bg-white/70 dark:bg-gray-800/70'
          }`}
          onClick={() => onSelect(category)}
        >
          <div className={`absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity duration-300 ${
            selectedCategoryId === category.id 
              ? 'from-primary/20 to-violet-600/20 opacity-20' 
              : 'from-gray-100 to-transparent group-hover:opacity-20'
          }`}></div>
          
          <CardContent className="p-5 flex flex-col items-center text-center relative z-10">
            <div className={`p-3 rounded-full mb-3 transition-all duration-300 ${
              selectedCategoryId === category.id 
                ? 'bg-primary/10 text-primary scale-110' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-primary/5 group-hover:text-primary/80 group-hover:scale-110'
            }`}>
              {category.icon}
            </div>
            <h3 className={`text-lg font-medium mb-1 transition-colors duration-200 ${
              selectedCategoryId === category.id 
                ? 'text-primary' 
                : 'text-gray-800 dark:text-gray-200'
            }`}>{category.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{category.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
