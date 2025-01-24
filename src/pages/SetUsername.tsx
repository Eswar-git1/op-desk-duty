import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';

// SetUsername.tsx
export default function SetUsername() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSetUsername = async () => {
    if (!username.trim()) {
      toast({
        title: 'Invalid Username',
        description: 'Username cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (!user?.id) {
        throw new Error('No authenticated user found');
      }

      const { error } = await supabase
        .from('players')
        .update({ 
          username: username.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Username Set!',
        description: `Welcome, ${username}!`,
      });

      navigate('/home');
    } catch (error) {
      console.error('Error setting username:', error);
      toast({
        title: 'Error',
        description: 'Failed to set username. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-white/80 backdrop-blur p-8 border-2 border-indigo-100 shadow-xl">
        <h2 className="text-3xl font-bold text-center">Set Your Username</h2>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <Button
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
          onClick={handleSetUsername}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Set Username'}
        </Button>
      </div>
    </div>
  );
}
