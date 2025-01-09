const { createClient } = require('@supabase/supabase-js');

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testSupabaseConnection() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

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