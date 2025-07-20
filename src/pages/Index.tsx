import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/LoginPage';
import { ChatInterface } from '@/components/ChatInterface';
import { Loader } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Initializing your executive experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="dark">
      <ChatInterface />
    </div>
  );
};

export default Index;
