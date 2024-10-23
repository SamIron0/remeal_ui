"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get("code");
      const callbackUrl = searchParams.get("callbackUrl") || "/search";

      if (!code) {
        return;
      }

      try {
        await supabase.auth.exchangeCodeForSession(code);
        toast.success("Confirmed, you are logged in now");
      } catch (error) {
        console.error("Error during authentication:", error);
        toast.error("Authentication failed");

      }

      router.push(callbackUrl);
    };

    handleAuthCallback();
  }, [router, supabase]);

  return (
    <div className="flex justify-center items-center h-screen">
      Processing authentication, please wait...
    </div>
  );
}
