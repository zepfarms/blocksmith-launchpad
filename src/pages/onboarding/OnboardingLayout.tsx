import { Outlet, useLocation } from "react-router-dom";

const stepMap: Record<string, number> = {
  "/start": 1,
  "/start/describe": 2,
  "/start/browse": 2,
  "/start/confirm": 3,
  "/start/name": 4,
  "/start/blocks": 5,
  "/start/signup": 6,
};

const totalSteps = 6;

export const OnboardingLayout = () => {
  const location = useLocation();
  const currentStep = stepMap[location.pathname] || 1;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Content */}
      <Outlet />
    </div>
  );
};
