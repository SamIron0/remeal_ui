"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/update_password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset email sent. Please check your inbox.");
    }
  };

  return (
    <div className="h-screen flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form onSubmit={handleResetPassword} className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <Input
          name="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-primary rounded-md px-4 py-2 text-white mb-2"
        >
          Reset Password
        </Button>
        {message && <p className="text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
