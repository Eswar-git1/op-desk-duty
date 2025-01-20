import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../lib/store';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<boolean | null>(null);
  const { isGuest } = useGameStore();

  useEffect(() => {
    if (!isGuest) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(!!session);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(!!session);
      });

      return () => subscription.unsubscribe();
    }
  }, [isGuest]);

  if (!isGuest && session === null) {
    return <div>Loading...</div>;
  }

  return isGuest || session ? <>{children}</> : <Navigate to="/auth" />;
}