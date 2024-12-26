import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssmrgterkydpnakncgsb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbXJndGVya3lkcG5ha25jZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMzc5NTgsImV4cCI6MjA1MDgxMzk1OH0.JFhURA5s9biTph2ZsLZVrljObpfkVu0CDMKtPI7YT8s';

export const supabase = createClient(supabaseUrl, supabaseKey); 