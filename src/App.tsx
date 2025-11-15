import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminPricing from "./pages/admin/Pricing";
import AdminCategories from "./pages/admin/Categories";
import FailedPayments from "./pages/admin/FailedPayments";
import Analytics from "./pages/admin/Analytics";
import AppStore from "./pages/dashboard/AppStore";
import Subscriptions from "./pages/dashboard/Subscriptions";
import { PurchaseHistory } from "./pages/dashboard/PurchaseHistory";
import { SubscriptionCheckout } from "./pages/dashboard/SubscriptionCheckout";
import BusinessIdeas from "./pages/BusinessIdeas";
import Features from "./pages/Features";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import GrantTerms from "./pages/GrantTerms";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import LogoGeneration from "./pages/dashboard/LogoGeneration";
import BusinessNameGenerator from "./pages/dashboard/BusinessNameGenerator";
import DomainNameGenerator from "./pages/dashboard/DomainNameGenerator";
import BusinessPlanGenerator from "./pages/dashboard/BusinessPlanGenerator";
import SocialMediaChecker from "./pages/dashboard/SocialMediaChecker";
import QRCodeGenerator from "./pages/dashboard/QRCodeGenerator";
import { OnboardingLayout } from "./pages/onboarding/OnboardingLayout";
import { IdeaStep } from "./pages/onboarding/IdeaStep";
import { DescribeIdea } from "./pages/onboarding/DescribeIdea";
import { BrowseIdeas } from "./pages/onboarding/BrowseIdeas";
import { ConfirmIdea } from "./pages/onboarding/ConfirmIdea";
import { BusinessName } from "./pages/onboarding/BusinessName";
import { BlockSelection } from "./pages/onboarding/BlockSelection";
import { Signup } from "./pages/onboarding/Signup";
import { Checkout } from "./pages/onboarding/Checkout";
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
              
              {/* Dashboard routes with shared layout */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="logos" element={<LogoGeneration />} />
                <Route path="business-name-generator" element={<BusinessNameGenerator />} />
                <Route path="domain-name-generator" element={<DomainNameGenerator />} />
                <Route path="business-plan-generator" element={<BusinessPlanGenerator />} />
                <Route path="social-media-checker" element={<SocialMediaChecker />} />
                <Route path="qr-code-generator" element={<QRCodeGenerator />} />
                <Route path="app-store" element={<AppStore />} />
                <Route path="subscriptions" element={<Subscriptions />} />
                <Route path="subscription-checkout" element={<SubscriptionCheckout />} />
                <Route path="purchase-history" element={<PurchaseHistory />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/pricing" element={<AdminPricing />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/failed-payments" element={<FailedPayments />} />
              
              {/* Other pages */}
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
                <Route path="checkout" element={<Checkout />} />
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
