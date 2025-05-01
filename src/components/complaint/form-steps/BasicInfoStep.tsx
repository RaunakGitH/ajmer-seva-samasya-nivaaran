
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategorySelector } from '@/components/complaint/category-selector';

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
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="complaint-title" className="text-base">Complaint Title</Label>
        <Input
          id="complaint-title"
          placeholder="Enter a brief title for your complaint"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-400"
        />
      </div>
      
      <div className="space-y-3 mt-8">
        <Label className="text-base">Select Category</Label>
        <CategorySelector
          onSelect={onCategorySelect}
          selectedCategoryId={category?.id || null}
        />
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-start">
          <div className="h-5 w-5 text-red-500 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
          </div>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
