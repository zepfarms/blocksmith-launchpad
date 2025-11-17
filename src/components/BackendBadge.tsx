import { useEffect, useState } from "react";
import { getBackendHost } from "@/lib/backendConfig";
import { Server } from "lucide-react";

export const BackendBadge = () => {
  const [host, setHost] = useState("");
  const [isProduction, setIsProduction] = useState(true);

  useEffect(() => {
    setHost(getBackendHost());
    setIsProduction(window.location.hostname !== 'localhost' && !window.location.hostname.includes('lovable.app'));
  }, []);

  // Don't show in production
  if (isProduction || !host) {
    return null;
  }

  const hasOverride = localStorage.getItem('acari.backend.url') !== null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black/90 backdrop-blur-sm border border-acari-green/30 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
        <Server className="w-4 h-4 text-acari-green" />
        <span className="text-xs text-white/90">
          {host}
        </span>
        {hasOverride && (
          <span className="text-xs text-acari-green font-semibold">
            (override)
          </span>
        )}
      </div>
    </div>
  );
};
