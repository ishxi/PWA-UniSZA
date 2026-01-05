// supabase.ts replaced to use local dbAdapter for demo.
// The original Supabase integration removed for demo/local usage.
// This file now re-exports the local dbAdapter so existing imports continue working.
import dbAdapter from './dbAdapter';
export const isUsingSupabase = false;
export const supabaseClient = null;
const dbService = dbAdapter;
export default dbService;
