import { supabase } from "@/supabase/supabaseClient";
import type { User } from "@supabase/supabase-js";
export const handleLogout = async() => {
  const { error } = await supabase.auth.signOut();  
  console.log("logged out successfully");
  if(error){
    console.error(error);
  }
}

export const getDisplayName = (user: User) => {
  const meta = user?.user_metadata ?? {}
  return (
    meta.full_name ||    
    meta.name ||      
    meta.username ||  
    meta.user_name || 
    user?.email ||       
    'Anon'       
  )
}