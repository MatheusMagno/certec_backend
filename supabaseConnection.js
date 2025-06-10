import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

dotenv.config();

const supanaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supanaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

export { supabase };