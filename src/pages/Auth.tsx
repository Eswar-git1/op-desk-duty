import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { useGameStore } from '../lib/store';
import { Card } from '../components/ui/card';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsGuest } = useGameStore();

  const handleAuth = async (type: 'login' | 'signup') => {
    try {
      setLoading(true);
      const { error } =
        type === 'signup'
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: type === 'signup' ? 'Account created!' : 'Welcome back!',
        description:
          type === 'signup'
            ? 'You can now start your desk duty.'
            : 'Ready to handle some paperwork?',
      });
      navigate('/home');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Authentication failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    toast({
      title: 'Welcome Guest Officer!',
      description: "Your progress won't be saved, but you can still enjoy the game.",
    });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md space-y-8 p-8 bg-white/80 backdrop-blur border-2 border-indigo-100 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Officer</h2>
          <p className="text-gray-600 mt-2">Sign in to begin your desk duty</p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-2 border-indigo-100 text-gray-800 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-colors"
              placeholder="officer@military.gov"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-2 border-indigo-100 text-gray-800 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-4 pt-4">
            <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
              onClick={() => handleAuth('login')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Sign In'}
            </Button>

            <Button
              variant="outline"
              className="w-full border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
              onClick={() => handleAuth('signup')}
              disabled={loading}
            >
              Create Account
            </Button>

            <Button
              variant="ghost"
              className="w-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              onClick={continueAsGuest}
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}