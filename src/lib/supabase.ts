import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Replace with your actual Supabase credentials
const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Message type definitions
export interface Message {
  id: string;
  created_at: string;
  session_id: string;
  message: {
    content: string;
    type: 'human' | 'ai';
  };
}

export interface AgentRequest {
  query: string;
  user_id: string;
  request_id: string;
  session_id: string;
}

export interface AgentResponse {
  success: boolean;
}