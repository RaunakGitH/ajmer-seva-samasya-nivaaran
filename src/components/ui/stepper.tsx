
import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

// Context to track step status
const StepperContext = React.createContext<{
  activeStep: number;
  orientation: "horizontal" | "vertical";
}>({ activeStep: 0, orientation: "horizontal" })

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number;
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, activeStep = 0, orientation = "horizontal", children, ...props }, ref) => {
    const stepCount = React.Children.count(children)
    
    return (
      <StepperContext.Provider value={{ activeStep, orientation }}>
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-col space-y-2" : "space-x-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    )
  }
)
Stepper.displayName = "Stepper"

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = React.useContext(StepperContext)
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex",
          orientation === "vertical" ? "flex-col" : "flex-col items-center",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Step.displayName = "Step"

interface StepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const StepIndicator = React.forwardRef<HTMLDivElement, StepIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = React.useContext(StepperContext)
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border",
          orientation === "vertical" ? "" : "flex-shrink-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StepIndicator.displayName = "StepIndicator"

interface StepStatusProps {
  complete: React.ReactNode;
  incomplete: React.ReactNode;
  active: React.ReactNode;
}

const StepStatus = ({ complete, incomplete, active }: StepStatusProps) => {
  const { activeStep } = React.useContext(StepperContext)
  const stepIndex = React.useContext(StepIndexContext)
  
  if (activeStep > stepIndex) {
    return <>{complete}</>
  }
  
  if (activeStep === stepIndex) {
    return <>{active}</>
  }
  
  return <>{incomplete}</>
}
StepStatus.displayName = "StepStatus"

const StepIcon = () => {
  return <Check className="h-4 w-4 text-primary" />
}
StepIcon.displayName = "StepIcon"

// Track step index for use in determining if a step is active, completed, etc.
const StepIndexContext = React.createContext<number>(0)

const StepNumber = () => {
  const stepIndex = React.useContext(StepIndexContext)
  const { activeStep } = React.useContext(StepperContext)
  
  return (
    <span className={cn(
      "text-sm font-medium",
      activeStep === stepIndex ? "text-primary" : "text-muted-foreground"
    )}>
      {stepIndex + 1}
    </span>
  )
}
StepNumber.displayName = "StepNumber"

interface StepTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const StepTitle = React.forwardRef<HTMLParagraphElement, StepTitleProps>(
  ({ className, ...props }, ref) => {
    const stepIndex = React.useContext(StepIndexContext)
    const { activeStep } = React.useContext(StepperContext)
    
    return (
      <p
        ref={ref}
        className={cn(
          "text-sm font-medium",
          activeStep >= stepIndex ? "text-foreground" : "text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
StepTitle.displayName = "StepTitle"

interface StepDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const StepDescription = React.forwardRef<HTMLParagraphElement, StepDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    )
  }
)
StepDescription.displayName = "StepDescription"

interface StepSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const StepSeparator = React.forwardRef<HTMLDivElement, StepSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = React.useContext(StepperContext)
    const stepIndex = React.useContext(StepIndexContext)
    const { activeStep } = React.useContext(StepperContext)
    
    return (
      <div
        ref={ref}
        className={cn(
          "absolute",
          orientation === "vertical"
            ? "left-4 top-9 -bottom-1 w-px -translate-x-1/2"
            : "top-4 left-8 -right-8 h-px",
          activeStep > stepIndex ? "bg-primary" : "bg-border",
          className
        )}
        {...props}
      />
    )
  }
)
StepSeparator.displayName = "StepSeparator"

// Create a wrapper component that provides the step index via context
const Steps = ({ children }: { children: React.ReactNode }) => {
  return React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child
    
    return (
      <StepIndexContext.Provider value={index}>
        {child}
      </StepIndexContext.Provider>
    )
  })
}
Steps.displayName = "Steps"

export {
  Stepper,
  Step,
  Steps,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
}
