import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminPricing from "./pages/admin/Pricing";
import AdminCategories from "./pages/admin/Categories";
import AppStore from "./pages/dashboard/AppStore";
import BusinessIdeas from "./pages/BusinessIdeas";
import Features from "./pages/Features";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import GrantTerms from "./pages/GrantTerms";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import LogoGeneration from "./pages/dashboard/LogoGeneration";
import { OnboardingLayout } from "./pages/onboarding/OnboardingLayout";
import { IdeaStep } from "./pages/onboarding/IdeaStep";
import { DescribeIdea } from "./pages/onboarding/DescribeIdea";
import { BrowseIdeas } from "./pages/onboarding/BrowseIdeas";
import { ConfirmIdea } from "./pages/onboarding/ConfirmIdea";
import { BusinessName } from "./pages/onboarding/BusinessName";
import { BlockSelection } from "./pages/onboarding/BlockSelection";
import { Signup } from "./pages/onboarding/Signup";
import { VerifyEmail } from "./pages/VerifyEmail";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/logos" element={<LogoGeneration />} />
              <Route path="/dashboard/app-store" element={<AppStore />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/pricing" element={<AdminPricing />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/business-ideas" element={<BusinessIdeas />} />
              <Route path="/features" element={<Features />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/grant-terms" element={<GrantTerms />} />
              <Route path="/support" element={<Support />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              
              {/* Onboarding flow */}
              <Route path="/start" element={<OnboardingLayout />}>
                <Route index element={<IdeaStep />} />
                <Route path="describe" element={<DescribeIdea />} />
                <Route path="browse" element={<BrowseIdeas />} />
                <Route path="confirm" element={<ConfirmIdea />} />
                <Route path="name" element={<BusinessName />} />
                <Route path="blocks" element={<BlockSelection />} />
                <Route path="signup" element={<Signup />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}

export default App;
