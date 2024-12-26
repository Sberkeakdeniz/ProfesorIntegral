const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ssmrgterkydpnakncgsb.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testConnection() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Testing connection...');
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1);
    
    if (error) throw error;
    
    console.log('Successfully connected to Supabase!');
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection(); 