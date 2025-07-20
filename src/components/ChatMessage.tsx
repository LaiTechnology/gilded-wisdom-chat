import { Message } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  userPhoto?: string;
}

export const ChatMessage = ({ message, userPhoto }: ChatMessageProps) => {
  const isHuman = message.message.type === 'human';

  return (
    <div className={cn(
      "flex gap-4 p-4",
      isHuman ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="w-8 h-8 border-2 border-primary/20">
        <AvatarImage src={isHuman ? userPhoto : undefined} />
        <AvatarFallback className={cn(
          isHuman 
            ? "bg-primary text-primary-foreground" 
            : "bg-gradient-primary text-primary-foreground"
        )}>
          {isHuman ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <Card className={cn(
        "max-w-[70%] p-4 shadow-sm",
        isHuman 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-card text-card-foreground"
      )}>
        <div className={cn(
          "prose prose-sm max-w-none",
          isHuman 
            ? "prose-invert" 
            : "prose-stone dark:prose-invert"
        )}>
          {isHuman ? (
            <p className="m-0">{message.message.content}</p>
          ) : (
            <ReactMarkdown 
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="mb-2 pl-4">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 pl-4">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                code: ({ children, className }) => (
                  <code className={cn(
                    "px-1.5 py-0.5 rounded text-xs",
                    isHuman 
                      ? "bg-primary-foreground/20 text-inherit" 
                      : "bg-muted text-muted-foreground",
                    className
                  )}>
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className={cn(
                    "p-3 rounded-lg overflow-x-auto text-sm",
                    isHuman 
                      ? "bg-primary-foreground/10" 
                      : "bg-muted"
                  )}>
                    {children}
                  </pre>
                )
              }}
            >
              {message.message.content}
            </ReactMarkdown>
          )}
        </div>
      </Card>
    </div>
  );
};