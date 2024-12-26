import { supabase } from './supabase';

export type User = {
  id: string;
  email: string;
  name?: string;
  created_at: string;
};

export type Test = {
  id: string;
  message: string;
  created_at: string;
};

// User operations
export async function createUser(email: string, name?: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, name }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUser(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single();
  
  if (error) throw error;
  return data;
}

// Test operations
export async function createTest(message: string) {
  const { data, error } = await supabase
    .from('tests')
    .insert([{ message }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getTests() {
  const { data, error } = await supabase
    .from('tests')
    .select()
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
} 