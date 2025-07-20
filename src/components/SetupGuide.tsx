import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Cloud, Key, ArrowLeft } from 'lucide-react';

export const SetupGuide = ({ onBack }: { onBack?: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {onBack && (
          <Button 
            onClick={onBack}
            variant="outline" 
            className="border-primary/20 hover:bg-primary/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        )}
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
            <Settings className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Executive Chat Setup
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete these steps to connect your premium AI advisor to Firebase and Supabase.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Firebase Setup */}
          <Card className="bg-gradient-card border-border/50 shadow-depth">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-primary" />
                <CardTitle>Firebase Authentication</CardTitle>
              </div>
              <CardDescription>Configure Google Sign-In authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Step 1</Badge>
                <p className="text-sm text-muted-foreground">
                  Create a Firebase project at <code className="bg-muted px-1 rounded">console.firebase.google.com</code>
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Step 2</Badge>
                <p className="text-sm text-muted-foreground">
                  Enable Google Sign-In in Authentication → Sign-in method
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Step 3</Badge>
                <p className="text-sm text-muted-foreground">
                  Update <code className="bg-muted px-1 rounded">src/lib/firebase.ts</code> with your config
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Supabase Setup */}
          <Card className="bg-gradient-card border-border/50 shadow-depth">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-primary" />
                <CardTitle>Supabase Database</CardTitle>
              </div>
              <CardDescription>Set up real-time messaging database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Step 1</Badge>
                <p className="text-sm text-muted-foreground">
                  Create a project at <code className="bg-muted px-1 rounded">supabase.com</code>
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Step 2</Badge>
                <p className="text-sm text-muted-foreground">
                  Create the messages table using the SQL below
                </p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">Step 3</Badge>
                <p className="text-sm text-muted-foreground">
                  Update <code className="bg-muted px-1 rounded">src/lib/supabase.ts</code> with your URL and key
                </p>
              </div>
            </CardContent>
          </Card>

          {/* API Setup */}
          <Card className="bg-gradient-card border-border/50 shadow-depth md:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-primary" />
                <CardTitle>Agent API Configuration</CardTitle>
              </div>
              <CardDescription>Connect to your Cloud Run agent endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Update the API endpoint in <code className="bg-muted px-1 rounded">src/components/ChatInterface.tsx</code> 
                on line 102 with your actual Cloud Run domain.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SQL Schema */}
        <Card className="bg-gradient-card border-border/50 shadow-depth">
          <CardHeader>
            <CardTitle>Supabase Messages Table Schema</CardTitle>
            <CardDescription>Run this SQL in your Supabase SQL editor</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`CREATE TABLE messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL
);

-- Enable real-time subscriptions
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Create index for better performance
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};