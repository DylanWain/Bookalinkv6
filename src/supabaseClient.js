import { createClient } from "@supabase/supabase-js";

// Get your Supabase URL and Anon Key from:
// https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://nstxfcncqkdkgxckgapf.supabase.co";
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdHhmY25jcWtka2d4Y2tnYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MjAxNDEsImV4cCI6MjA3Njk5NjE0MX0.x1MxF-5S8q3iqQ9zpMeDWR5-UbLTxLt8Hwd5q2KwUMU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
