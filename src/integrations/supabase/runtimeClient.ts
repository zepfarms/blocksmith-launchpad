// Runtime Supabase client that uses config.json instead of .env
// This prevents the builder from reverting backend connections
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getBackendConfig } from '@/lib/backendConfig';

let clientInstance: SupabaseClient<Database> | null = null;

// Initialize client with localStorage override support
const initializeClient = (): SupabaseClient<Database> => {
  // Check localStorage overrides first (for admin testing)
  const overrideUrl = localStorage.getItem('acari.backend.url');
  const overrideKey = localStorage.getItem('acari.backend.key');
  
  let url: string;
  let anonKey: string;
  
  if (overrideUrl && overrideKey) {
    console.log('[Supabase] Using localStorage override:', overrideUrl);
    url = overrideUrl;
    anonKey = overrideKey;
  } else {
    // Use env vars (which match config.json in production)
    url = import.meta.env.VITE_SUPABASE_URL || '';
    anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
    console.log('[Supabase] Initialized with backend:', url);
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

// Initialize immediately on module load
clientInstance = initializeClient();

// Export the client instance directly (always available)
export const supabase = clientInstance;

// Async getter for explicit async usage (returns same instance)
export const getSupabase = async (): Promise<SupabaseClient<Database>> => {
  return clientInstance!;
};

// Re-export types for convenience
export type { Database } from './types';
