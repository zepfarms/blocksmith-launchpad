import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const stepMap: Record<string, number> = {
  "/start": 1,
  "/start/describe": 2,
  "/start/browse": 2,
  "/start/confirm": 3,
  "/start/name": 4,
  "/start/blocks": 5,
  "/start/signup": 6,
};

const breadcrumbLabels: Record<string, string> = {
  "/start": "Get Started",
  "/start/describe": "Describe Idea",
  "/start/browse": "Browse Ideas",
  "/start/confirm": "Confirm Idea",
  "/start/name": "Business Name",
  "/start/blocks": "Select Blocks",
  "/start/signup": "Create Account",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Back Button */}
      {backPath && (
        <div className="fixed top-8 left-4 sm:left-8 z-40">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(backPath)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumbLabels[location.pathname] || "Start Building"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <Outlet />
    </div>
  );
};
