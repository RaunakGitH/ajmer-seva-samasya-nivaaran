
import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Steps,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
} from "@/components/ui/stepper";

interface ComplaintFormLayoutProps {
  children: ReactNode;
  activeStep: number;
  steps: { title: string; description: string }[];
  onStepClick: (stepIndex: number) => void;
  title?: string;
  subtitle?: string;
}

export function ComplaintFormLayout({
  children,
  activeStep,
  steps,
  onStepClick,
  title = "Submit a Complaint",
  subtitle = "Help us improve our community by reporting civic issues that need attention"
}: ComplaintFormLayoutProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/40">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 rounded-full hover:bg-white/80 backdrop-blur-sm flex items-center gap-2 group transition-all duration-300 dark:hover:bg-gray-800/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </Button>
          
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="relative mb-6 inline-block">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4 tracking-tight">
                  {title}
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-600/70 to-violet-500/70 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                {subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <Card className="sticky top-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-lg shadow-purple-500/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent"></div>
                  <CardContent className="p-4 relative">
                    <Stepper orientation="vertical" activeStep={activeStep} className="min-h-72">
                      {steps.map((step, index) => (
                        <Step key={index} onClick={() => onStepClick(index)} className="cursor-pointer">
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>
                          <div className="ml-3">
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                          </div>
                          {index < steps.length - 1 && <StepSeparator />}
                        </Step>
                      ))}
                    </Stepper>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl shadow-purple-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                  <CardHeader className="space-y-2 border-b dark:border-gray-700/50 pb-4 relative">
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">{steps[activeStep].title}</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      {steps[activeStep].description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6 px-6">
                    {children}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
