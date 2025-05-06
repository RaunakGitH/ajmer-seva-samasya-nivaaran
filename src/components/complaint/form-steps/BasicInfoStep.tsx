
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategorySelector } from '@/components/complaint/category-selector';
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
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input value changing to:", e.target.value);
    setTitle(e.target.value);
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
        <Label className="text-base">Select Category</Label>
        <CategorySelector
          onSelect={onCategorySelect}
          selectedCategoryId={category?.id || null}
        />
      </div>

      {error && <ErrorDisplay error={error} />}
    </div>
  );
}
