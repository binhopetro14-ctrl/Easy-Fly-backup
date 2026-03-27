import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for real-time status indication
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('customers').select('id', { count: 'exact', head: true });
    return !error;
  } catch (error) {
    return false;
  }
};
