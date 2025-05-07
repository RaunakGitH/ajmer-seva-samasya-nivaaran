
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ErrorDisplay } from '@/components/complaint/ErrorDisplay';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface BasicInfoStepProps {
  title: string;
  setTitle: (value: string) => void;
  category: Category | null;
  onCategorySelect: (category: Category) => void;
  error: string | null;
}

export function BasicInfoStep({ title, setTitle, category, onCategorySelect, error }: BasicInfoStepProps) {
  // Define the categories here for the dropdown
  const categories = [
    { id: 'road', name: 'Road', description: 'Potholes, damaged roads, traffic issues' },
    { id: 'garbage', name: 'Garbage', description: 'Waste collection, dumping issues, cleanliness' },
    { id: 'water', name: 'Water', description: 'Water supply, leakage, quality issues' },
    { id: 'electricity', name: 'Electricity', description: 'Power outages, street lights, electrical hazards' },
    { id: 'property', name: 'Property', description: 'Illegal construction, encroachment, property disputes' },
    { id: 'environment', name: 'Environment', description: 'Air pollution, noise pollution, tree cutting' },
    { id: 'other', name: 'Other', description: 'Other civic issues not listed above' }
  ];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input value changing to:", e.target.value);
    setTitle(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find(cat => cat.id === value);
    if (selectedCategory) {
      onCategorySelect({
        ...selectedCategory,
        icon: null // We're not using icons anymore
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="complaint-title" className="text-base">Complaint Title</Label>
        <Input
          id="complaint-title"
          placeholder="Enter a brief title for your complaint"
          value={title}
          onChange={handleTitleChange}
          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-400 text-gray-900 dark:text-gray-100"
        />
      </div>
      
      <div className="space-y-3 mt-8">
        <Label htmlFor="category-select" className="text-base">Select Category</Label>
        <Select 
          value={category?.id || ""} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category-select" className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="text-gray-900 dark:text-gray-100">
                {cat.name} - {cat.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <ErrorDisplay error={error} />}
    </div>
  );
}
