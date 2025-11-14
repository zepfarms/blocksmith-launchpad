import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

const stepMap: Record<string, number> = {
  "/start": 1,
  "/start/describe": 2,
  "/start/browse": 2,
  "/start/confirm": 3,
  "/start/name": 4,
  "/start/blocks": 5,
  "/start/signup": 6,
};

const backLabels: Record<string, string> = {
  "/start/describe": "Back",
  "/start/browse": "Back",
  "/start/confirm": "Back",
  "/start/name": "Back",
  "/start/blocks": "Back",
  "/start/signup": "Back",
};

const backPathMap: Record<string, string> = {
  "/start/describe": "/start",
  "/start/browse": "/start",
  "/start/confirm": "/start/describe",
  "/start/name": "/start/confirm",
  "/start/blocks": "/start/name",
  "/start/signup": "/start/blocks",
};

const totalSteps = 6;

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
      
      {/* Progress Bar - positioned below header */}
      <div className="fixed top-[72px] sm:top-[80px] left-0 right-0 h-1 bg-border z-40">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Content with proper spacing */}
      <div className="relative pt-[72px] sm:pt-[80px]">
        {backPath && (
          <div className="absolute top-[96px] sm:top-[104px] left-4 sm:left-6 z-10">
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
      </div>
    </div>
  );
};
