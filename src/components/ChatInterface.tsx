import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Message, AgentRequest } from '@/lib/supabase';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Crown, Loader, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const ChatInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages for current session
  useEffect(() => {
    if (!currentSessionId) return;

    loadMessages(currentSessionId);
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `session_id=eq.${currentSessionId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          setLoading(false);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentSessionId]);

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !currentSessionId) return;

    setLoading(true);
    setError(null);

    try {
      // First, add user message to Supabase
      const userMessage = {
        session_id: currentSessionId,
        message: {
          content,
          type: 'human' as const
        }
      };

      const { error: insertError } = await supabase
        .from('messages')
        .insert([userMessage]);

      if (insertError) throw insertError;

      // Then send to agent API
      const agentRequest: AgentRequest = {
        query: content,
        user_id: user.uid,
        request_id: uuidv4(),
        session_id: currentSessionId
      };

      const response = await fetch('https://your-cloud-run-domain.run.app/api/pydantic-github-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to send message to agent');
      }

      // Agent response will come via real-time subscription
    } catch (error: any) {
      console.error('Error sending message:', error);
      setLoading(false);
      
      // Show user-friendly error message
      if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to AI service. Please check your internet connection.');
      } else if (error.message.includes('cloud-run-domain')) {
        setError('AI service not configured. Please update the API endpoint.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    setCurrentSessionId(newSessionId);
    setMessages([]);
  };

  const handleSelectChat = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  // Initialize with first chat if none exists
  useEffect(() => {
    if (!currentSessionId) {
      handleNewChat();
    }
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Executive AI Advisor
            </h1>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && !loading ? (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
                    <Crown className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Ready to assist you
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Ask me anything about strategy, leadership, or complex problem-solving. 
                    I'm here to provide executive-level insights.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    userPhoto={user?.photoURL || undefined}
                  />
                ))}
                {loading && (
                  <div className="flex gap-4 p-4">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Analyzing your request...</span>
                    </div>
                    </div>
                  )}
                {error && (
                  <div className="flex gap-4 p-4">
                    <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-destructive-foreground" />
                    </div>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex-1">
                      <div className="flex items-center space-x-2 text-destructive text-sm">
                        <span>{error}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border">
          <div className="max-w-4xl mx-auto">
            <ChatInput 
              onSendMessage={sendMessage}
              disabled={!currentSessionId}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};