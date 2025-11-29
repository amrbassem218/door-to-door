"use client";

import { supabase } from "@/supabase/supabaseClient";

export const handleGoogleAuth = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      redirectTo: 'https://google.com',
    },
  });
};
