import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Crown, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5" />
      
      <Card className="relative w-full max-w-md bg-gradient-card border-border/50 shadow-depth">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Executive Chat
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Your premium AI advisor awaits
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>Powered by advanced AI</span>
              <Sparkles className="w-4 h-4" />
            </div>
            
            <Button 
              onClick={signInWithGoogle}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Secure authentication powered by Firebase
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-muted-foreground">
        Built for leaders who demand excellence
      </div>
    </div>
  );
};