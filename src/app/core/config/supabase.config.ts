import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export type { SupabaseClient };

export const SUPABASE_URL = environment.supabase.url;
export const SUPABASE_ANON_KEY = environment.supabase.anonKey;

export function createSupabaseClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Las credenciales de Supabase no están configuradas. Por favor, configura SUPABASE_URL y SUPABASE_ANON_KEY en environment.ts');
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

