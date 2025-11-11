import { createContext, useContext, useState, ReactNode } from "react";

interface BusinessIdea {
  id: string;
  category: string;
  name: string;
  description: string;
  starter_blocks: string;
  growth_blocks: string;
}

interface OnboardingData {
  businessIdea: string;
  aiAnalysis: string;
  selectedIdeaRow: BusinessIdea | null;
  businessName: string;
  selectedBlocks: string[];
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const initialData: OnboardingData = {
  businessIdea: "",
  aiAnalysis: "",
  selectedIdeaRow: null,
  businessName: "",
  selectedBlocks: [],
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>(initialData);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};
