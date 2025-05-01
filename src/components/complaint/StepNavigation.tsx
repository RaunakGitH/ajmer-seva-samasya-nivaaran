
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  activeStep: number;
  totalSteps: number;
  onNextClick: () => void;
  onPreviousClick: () => void;
}

export function StepNavigation({ 
  activeStep, 
  totalSteps, 
  onNextClick, 
  onPreviousClick 
}: StepNavigationProps) {
  return (
    <div className="mt-8 flex justify-between">
      <Button
        variant="outline"
        onClick={onPreviousClick}
        disabled={activeStep === 0}
        className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      >
        Previous
      </Button>
      <Button 
        onClick={onNextClick}
        className="min-w-[100px] bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-600 hover:to-violet-600 transition-all duration-300"
      >
        Next
      </Button>
    </div>
  );
}
