import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://asgtqijchvmmpwrqyzlj.supabase.co'; // Твой URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZ3RxaWpjaHZtbXB3cnF5emxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTkzNzUzNCwiZXhwIjoyMDk1NTEzNTM0fQ.RGLrhGEG5KvhwYm6zJcSKa8wGVYRpOVCJC5chOWYFc0';             // Твой анон-ключ

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);