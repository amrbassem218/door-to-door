'use client';

import { supabase } from "@/supabase/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setUser(session?.user ?? null);
      setLoading(false);
    })

    const {data: listener} = supabase.auth.onAuthStateChange((e, session) => {
      setUser(session?.user ?? null);
    })

    return (() => {
      listener.subscription.unsubscribe();
    })
  }, [])
  return {user, loading};
}