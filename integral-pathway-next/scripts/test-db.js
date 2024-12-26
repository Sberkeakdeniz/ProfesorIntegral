const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: 'kdWEtcEzihrW4yHa',
  host: 'ssmrgterkydpnakncgsb.supabase.co',
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  },
  statement_timeout: 10000,
  query_timeout: 10000,
  connectionTimeoutMillis: 10000,
  options: '-c statement_timeout=10000',
  application_name: 'test_connection',
  keepalive: 1,
  keepalives_idle: 30
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database using pgbouncer in transaction mode...');
    await client.connect();
    console.log('Successfully connected to the database');
    const result = await client.query('SELECT NOW()');
    console.log('Database time:', result.rows[0].now);
    await client.end();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.message) {
      console.error('Error message:', error.message);
    }
  }
}

testConnection(); 