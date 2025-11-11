import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { SmartBlockSelector } from "@/components/SmartBlockSelector";
import { useEffect } from "react";

export const BlockSelection = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();

  useEffect(() => {
    if (!data.aiAnalysis) {
      navigate("/start");
    }
  }, [data.aiAnalysis, navigate]);

  const handleComplete = (selectedBlocks: string[]) => {
    updateData({ selectedBlocks });
    navigate("/start/signup");
  };

  return (
    <SmartBlockSelector
      starterBlocks={data.selectedIdeaRow?.starter_blocks || ""}
      growthBlocks={data.selectedIdeaRow?.growth_blocks || ""}
      onComplete={handleComplete}
    />
  );
};
