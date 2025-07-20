import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

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