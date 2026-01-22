import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// TEMPORARY FIX: Hardcoding keys to bypass .env issues
// ------------------------------------------------------------------

const SUPABASE_URL = "https://kmxipwflgbwnzxldwmon.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtteGlwd2ZsZ2J3bnp4bGR3bW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNjU4MTMsImV4cCI6MjA4MjY0MTgxM30.PUPI_KDVOIkG36K8_Hf_96OFARitU3aLMimfK2kX_Ag";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);