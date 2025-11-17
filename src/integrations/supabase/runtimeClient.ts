// Runtime Supabase client that uses config.json instead of .env
// This prevents the builder from reverting backend connections
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

let clientInstance: SupabaseClient<Database> | null = null;

// Fetch config.json synchronously at module load
const loadConfig = (): { url: string; anonKey: string } => {
  // Check localStorage overrides first (for admin testing)
  const overrideUrl = localStorage.getItem('acari.backend.url');
  const overrideKey = localStorage.getItem('acari.backend.key');
  
  if (overrideUrl && overrideKey) {
    console.log('[Supabase] Using localStorage override:', overrideUrl.replace(/https?:\/\/([^.]+)\..*/, '$1'));
    return { url: overrideUrl, anonKey: overrideKey };
  }

  // Try to fetch config.json synchronously
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/config.json', false); // synchronous request
    xhr.send(null);
    
    if (xhr.status === 200) {
      const config = JSON.parse(xhr.responseText);
      console.log('[Supabase] Loaded from config.json:', config.backendUrl.replace(/https?:\/\/([^.]+)\..*/, '$1'));
      return { url: config.backendUrl, anonKey: config.publishableKey };
    }
  } catch (error) {
    console.warn('[Supabase] Failed to load config.json, falling back to env:', error);
  }

  // Fallback to env vars (only for local dev/build time)
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  console.log('[Supabase] Using env fallback:', envUrl.replace(/https?:\/\/([^.]+)\..*/, '$1'));
  return { url: envUrl, anonKey: envKey };
};

// Initialize client immediately on module load
const { url, anonKey } = loadConfig();

clientInstance = createClient<Database>(url, anonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export the client instance directly (always available)
export const supabase = clientInstance;

// Async getter for explicit async usage (returns same instance)
export const getSupabase = async (): Promise<SupabaseClient<Database>> => {
  return clientInstance!;
};

// Re-export types for convenience
export type { Database } from './types';
