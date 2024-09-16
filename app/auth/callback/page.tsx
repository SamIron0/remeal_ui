'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get('code');
      const callbackUrl = searchParams.get('callbackUrl') || '/search';

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          // User is now signed in
          toast.success('Email confirmed. You are now signed in.');
          router.push(callbackUrl);
        } catch (error) {
          console.error('Error during authentication:', error);
          toast.error('An error occurred during authentication. Please try again.');
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return <div>Processing authentication, please wait...</div>;
}
