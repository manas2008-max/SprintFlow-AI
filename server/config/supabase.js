const { createClient } = require('@supabase/supabase-js');

let supabase = null;
let initialized = false;
let isConfigured = false;

function initSupabase() {
  if (initialized) return { supabase, isConfigured };

  let supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/i, '').trim();
  // Prefer Service Role Key for full admin database access if provided
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

  if (supabaseUrl && supabaseKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
      });
      isConfigured = true;
      const keyType = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role (Admin)' : 'Anon';
      console.log(`[Database] Supabase PostgreSQL Client connected -> ${supabaseUrl} (${keyType})`);
    } catch (err) {
      console.warn('[Database Warning] Supabase client initialization error:', err.message);
      isConfigured = false;
    }
  } else {
    console.log('[Database] Running in high-performance memory mode.');
  }

  initialized = true;
  return { supabase, isConfigured };
}

const getSupabase = () => {
  initSupabase();
  return supabase;
};

const getIsConfigured = () => {
  initSupabase();
  return isConfigured;
};

module.exports = { initSupabase, getSupabase, getIsConfigured };
