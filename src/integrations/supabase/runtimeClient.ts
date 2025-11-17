// Runtime Supabase client that uses config.json instead of .env
// This prevents the builder from reverting backend connections
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getBackendConfig } from '@/lib/backendConfig';

let clientInstance: SupabaseClient<Database> | null = null;
let initPromise: Promise<SupabaseClient<Database>> | null = null;

const initializeClient = async (): Promise<SupabaseClient<Database>> => {
  const config = await getBackendConfig();
  
  const client = createClient<Database>(config.url, config.anonKey, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
  
  console.log('[Supabase] Runtime client initialized:', config.url);
  return client;
};

// Get the Supabase client instance
// First call will initialize, subsequent calls return the same instance
export const getSupabase = async (): Promise<SupabaseClient<Database>> => {
  if (clientInstance) {
    return clientInstance;
  }
  
  if (!initPromise) {
    initPromise = initializeClient();
  }
  
  clientInstance = await initPromise;
  return clientInstance;
};

// Synchronous export for compatibility (will use cached instance or throw)
// Most code should use getSupabase() instead
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get: (target, prop) => {
    if (!clientInstance) {
      throw new Error('Supabase client not initialized. Use getSupabase() or ensure app has loaded.');
    }
    return (clientInstance as any)[prop];
  }
});

// Initialize on module load
getSupabase().catch(err => {
  console.error('[Supabase] Failed to initialize client:', err);
});

// Re-export types for convenience
export type { Database } from './types';
