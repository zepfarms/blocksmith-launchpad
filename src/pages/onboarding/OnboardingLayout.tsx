import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const stepMap: Record<string, number> = {
  "/start": 1,
  "/start/describe": 2,
  "/start/confirm": 3,
  "/start/name": 4,
  "/start/blocks": 5,
  "/start/signup": 6,
};

const backLabels: Record<string, string> = {
  "/start/describe": "Back",
  "/start/confirm": "Back",
  "/start/name": "Back",
  "/start/blocks": "Back",
  "/start/signup": "Back",
};

const backPathMap: Record<string, string> = {
  "/start/describe": "/start",
  "/start/confirm": "/start/describe",
  "/start/name": "/start/confirm",
  "/start/blocks": "/start/name",
  "/start/signup": "/start/blocks",
};

const totalSteps = 6;

const stepLabels = [
  "Start",
  "Describe",
  "Confirm",
  "Name",
  "Tools",
  "Sign Up"
];

export const OnboardingLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentStep = stepMap[location.pathname] || 1;
  const progressPercentage = (currentStep / totalSteps) * 100;
  const backPath = backPathMap[location.pathname];
  const backLabel = backLabels[location.pathname];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <Header />
      
      {/* Progress Bar */}
      <div className="fixed top-[80px] sm:top-[96px] md:top-[112px] left-0 right-0 h-1 bg-border z-[90]">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="fixed top-[81px] sm:top-[97px] md:top-[113px] left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-[90]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            {Array.from({ length: totalSteps }, (_, i) => {
              const stepNum = i + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              
              return (
                <div key={stepNum} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {/* Circle */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 mx-auto",
                        isCompleted && "bg-acari-green text-black",
                        isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        stepNum
                      )}
                    </div>
                  </div>
                  {/* Label */}
                  <span
                    className={cn(
                      "text-xs mt-2 transition-all duration-300 hidden sm:block",
                      isCurrent && "font-semibold text-foreground",
                      !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {stepLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content with proper spacing */}
      <div className="relative pt-[160px] sm:pt-[170px] md:pt-[190px]">
        {backPath && (
          <div className="absolute top-[180px] sm:top-[190px] md:top-[210px] left-4 sm:left-6 z-10">
            <button
              onClick={() => navigate(backPath)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>←</span>
              <span>{backLabel}</span>
            </button>
          </div>
        )}
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};
