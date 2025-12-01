"use client";

import { supabase } from "@/supabase/supabaseClient";

export const handleGoogleAuth = () => {
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/auth/callback`,
    },
  });
};

export const handlePasswordLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const handlePasswordSignup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/auth/callback`,
    },
  });
  if (error) {
    return { data, error };
  }
  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabase.from("profiles").update([
      {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
      },
    ]).eq("id", userId);
    if (profileError) {
      console.log("Error creating user profile:", profileError.message);
      return { data, error: profileError };
    }
  }
  return { data, error };
};
