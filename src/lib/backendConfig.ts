// Backend configuration with localStorage override support
// This allows the app to connect to independent Supabase backend
// without relying on .env which gets auto-managed by the builder

interface BackendConfig {
  url: string;
  anonKey: string;
}

let cachedConfig: BackendConfig | null = null;

export const getBackendConfig = async (): Promise<BackendConfig> => {
  // Check localStorage overrides first (for admin emergency changes)
  const overrideUrl = localStorage.getItem('acari.backend.url');
  const overrideKey = localStorage.getItem('acari.backend.key');
  
  if (overrideUrl && overrideKey) {
    console.log('[Backend] Using localStorage override:', overrideUrl);
    return {
      url: overrideUrl,
      anonKey: overrideKey
    };
  }

  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig;
  }

  // Load from public/config.json
  try {
    const response = await fetch('/config.json');
    const config = await response.json();
    
    cachedConfig = {
      url: config.backendUrl,
      anonKey: config.publishableKey
    };
    
    console.log('[Backend] Loaded config from config.json:', cachedConfig.url);
    return cachedConfig;
  } catch (error) {
    console.error('[Backend] Failed to load config.json, falling back to env:', error);
    
    // Fallback to env (should never happen in production)
    cachedConfig = {
      url: import.meta.env.VITE_SUPABASE_URL || '',
      anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
    };
    
    return cachedConfig;
  }
};

// Get backend host for display purposes
export const getBackendHost = (): string => {
  const overrideUrl = localStorage.getItem('acari.backend.url');
  if (overrideUrl) {
    try {
      return new URL(overrideUrl).host;
    } catch {
      return 'invalid-url';
    }
  }
  
  if (cachedConfig) {
    try {
      return new URL(cachedConfig.url).host;
    } catch {
      return 'unknown';
    }
  }
  
  return 'loading...';
};

// Clear localStorage overrides
export const clearBackendOverrides = () => {
  localStorage.removeItem('acari.backend.url');
  localStorage.removeItem('acari.backend.key');
  cachedConfig = null;
  console.log('[Backend] Cleared overrides, will reload from config.json');
};

// Set localStorage overrides
export const setBackendOverrides = (url: string, key: string) => {
  localStorage.setItem('acari.backend.url', url);
  localStorage.setItem('acari.backend.key', key);
  cachedConfig = null;
  console.log('[Backend] Set overrides:', url);
};
