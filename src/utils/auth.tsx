"use client";

import { supabase } from "@/supabase/supabaseClient";

export const handleGoogleAuth = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
