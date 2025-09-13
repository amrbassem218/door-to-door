// routes/AuthCallback.tsx
import { supabase } from '@/supabase/supabaseClient'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    })
  }, [navigate])

  return <p>Signing you in...</p>
}
