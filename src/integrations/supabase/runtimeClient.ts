// Runtime Supabase client that uses config.json instead of .env
// This prevents the builder from reverting backend connections
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getBackendConfig } from '@/lib/backendConfig';

let clientInstance: SupabaseClient<Database> | null = null;

// Initialize client synchronously with env fallback, then upgrade when config loads
const initializeClientSync = (): SupabaseClient<Database> => {
  // Check localStorage overrides first
  const overrideUrl = localStorage.getItem('acari.backend.url');
  const overrideKey = localStorage.getItem('acari.backend.key');
  
  let url: string;
  let anonKey: string;
  
  if (overrideUrl && overrideKey) {
    console.log('[Supabase] Using localStorage override:', overrideUrl);
    url = overrideUrl;
    anonKey = overrideKey;
  } else {
    // Use env as immediate fallback (will be replaced when config loads)
    url = import.meta.env.VITE_SUPABASE_URL || '';
    anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
    console.log('[Supabase] Initializing with env fallback, will load config.json...');
    
    // Asynchronously load config and upgrade client
    upgradeToConfigClient();
  }
  
  const client = createClient<Database>(url, anonKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
  
  return client;
};

// Upgrade to config.json when it loads
const upgradeToConfigClient = async () => {
  try {
    const config = await getBackendConfig();
    
    // Only upgrade if we're not using localStorage override
    const overrideUrl = localStorage.getItem('acari.backend.url');
    if (!overrideUrl) {
      console.log('[Supabase] Upgrading to config.json:', config.url);
      clientInstance = createClient<Database>(config.url, config.anonKey, {
        auth: {
          storage: localStorage,
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    }
  } catch (error) {
    console.warn('[Supabase] Failed to load config.json, keeping env fallback:', error);
  }
};

// Initialize immediately on module load
clientInstance = initializeClientSync();

// Export the client instance directly (always available)
export const supabase = clientInstance;

// Async getter for explicit async usage (returns same instance)
export const getSupabase = async (): Promise<SupabaseClient<Database>> => {
  return clientInstance!;
};

// Re-export types for convenience
export type { Database } from './types';
