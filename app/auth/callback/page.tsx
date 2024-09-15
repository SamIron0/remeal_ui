'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get('code');
      const callbackUrl = searchParams.get('callbackUrl') || '/search';

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      router.push(callbackUrl);
    };

    handleAuthCallback();
  }, [router]);

  return <div>Processing authentication, please wait...</div>;
}
