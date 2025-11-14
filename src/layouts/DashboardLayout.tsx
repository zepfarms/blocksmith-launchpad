import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[72px] sm:pt-[80px]">
        <Outlet />
      </main>
    </div>
  );
};
