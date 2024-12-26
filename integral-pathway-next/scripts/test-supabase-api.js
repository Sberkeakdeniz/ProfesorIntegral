const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = 'https://ssmrgterkydpnakncgsb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbXJndGVya3lkcG5ha25jZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMzc5NTgsImV4cCI6MjA1MDgxMzk1OH0.JFhURA5s9biTph2ZsLZVrljObpfkVu0CDMKtPI7YT8s';

async function testSupabaseConnection() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Testing connection...');
    
    // First, let's just try to get the auth configuration to test the connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Connection error:', authError.message);
      return;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Auth status:', authData ? 'Connected' : 'No session');

  } catch (error) {
    console.error('Error:', error);
    if (error.message) {
      console.error('Error message:', error.message);
    }
  }
}

console.log('Starting connection test...');
console.log('URL:', supabaseUrl);
testSupabaseConnection(); 