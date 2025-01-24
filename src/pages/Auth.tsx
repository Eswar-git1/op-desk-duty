import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { useGameStore } from '../lib/store';
import { Card } from '../components/ui/card';

interface PlayerData {
  id: string;
  username: string | null;
  current_rank: string;
  sanity_points: number;
  paperwork_completed: number;
  medals_earned: number;
}

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsGuest } = useGameStore();

  const createPlayerProfile = async (supabase: SupabaseClient, userId: string) => {
    try {
      const { data, error: insertError } = await supabase
        .from('players')
        .insert([{
          id: userId,
          username: null,
          current_rank: 'Lieutenant',
          sanity_points: 100,
          paperwork_completed: 0,
          medals_earned: 0
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Error inserting player: ${insertError.message}`);
      }

      console.log('Successfully created player profile:', data);
      return data;
    } catch (error) {
      console.error('Error in createPlayerProfile:', error);
      throw error;
    }
  };

  const handleAuth = async (type: 'login' | 'signup') => {
    try {
      setLoading(true);

      if (!email || !password) {
        throw new Error('Email and password are required.');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      const { data: authData, error: authError } = type === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) throw authError;

      if (type === 'signup' && authData?.user) {
        try {
          await createPlayerProfile(supabase, authData.user.id);
          navigate('/set-username');
          toast({
            title: 'Account created!',
            description: 'Please set your username to continue.',
          });
          return;
        } catch (profileError) {
          console.error('Failed to create player profile:', profileError);
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error('Failed to create player profile. Please try again.');
        }
      } else {
        const { data: player } = await supabase
          .from('players')
          .select('username')
          .eq('id', authData?.user?.id)
          .single();

        if (!player?.username) {
          navigate('/set-username');
          toast({
            title: 'Welcome back!',
            description: 'Please set your username to continue.',
          });
          return;
        }

        toast({
          title: 'Welcome back!',
          description: 'Ready to handle some paperwork?',
        });
        navigate('/home');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: 'guest@military.gov',
        password: 'guest123'  // Make sure this matches your actual guest account password
      });

      if (error) throw error;

      setIsGuest(true);
      toast({
        title: 'Welcome Guest Officer!',
        description: "Your progress won't be saved, but you can still enjoy the game.",
      });
      navigate('/home');
    } catch (error) {
      console.error('Guest login error:', error);
      // Fallback to local guest mode if server auth fails
      setIsGuest(true);
      toast({
        title: 'Welcome Guest Officer!',
        description: "Running in offline mode. Your progress won't be saved.",
      });
      navigate('/home');
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue as Guest'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}