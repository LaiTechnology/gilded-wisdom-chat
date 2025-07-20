import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MessageSquare, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  session_id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (sessionId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const ChatSidebar = ({ 
  currentSessionId, 
  onNewChat, 
  onSelectChat, 
  collapsed, 
  onToggleCollapse 
}: ChatSidebarProps) => {
  const { logout, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user) return;
    
    loadConversations();
  }, [user]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('session_id, message, created_at')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by session_id and get first human message as title
      const sessionsMap = new Map<string, Conversation>();
      
      data?.forEach((msg) => {
        if (!sessionsMap.has(msg.session_id) && msg.message.type === 'human') {
          const title = msg.message.content.slice(0, 100) + (msg.message.content.length > 100 ? '...' : '');
          sessionsMap.set(msg.session_id, {
            session_id: msg.session_id,
            title,
            created_at: msg.created_at,
          });
        }
      });

      const sortedConversations = Array.from(sessionsMap.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setConversations(sortedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border h-full flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-sidebar-foreground">Conversations</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
        
        {!collapsed && (
          <Button 
            onClick={onNewChat}
            className="w-full mt-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        )}
        
        {collapsed && (
          <Button 
            onClick={onNewChat}
            size="sm"
            className="w-full mt-3 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground p-2"
          >
            <PlusCircle className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <Button
              key={conv.session_id}
              variant={currentSessionId === conv.session_id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-auto p-3",
                collapsed ? "px-2" : "",
                currentSessionId === conv.session_id 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              onClick={() => onSelectChat(conv.session_id)}
            >
              <MessageSquare className={cn("w-4 h-4", collapsed ? "" : "mr-3")} />
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(conv.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={user.photoURL || ''} 
              alt={user.displayName || 'User'} 
              className="w-8 h-8 rounded-full"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={logout}
          variant="ghost"
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed ? "w-full p-2" : "w-full justify-start"
          )}
        >
          <LogOut className={cn("w-4 h-4", collapsed ? "" : "mr-2")} />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  );
};