import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export const useSupabaseAuth = () => {
  const [session, setSession] = useState(supabase.auth.getSession());
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // Fix the unsubscribe error by properly handling the subscription
  // Look for this code block and fix it
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return { session, user };
};
