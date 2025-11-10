// routes/AuthCallback.tsx
import { supabase } from '@/supabase/supabaseClient'
import { useRouter } from 'next/router';
import { useEffect } from 'react'

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      }
    })
  }, [router])

  return <p>Signing you in...</p>
}
