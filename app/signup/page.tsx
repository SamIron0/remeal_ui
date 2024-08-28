import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const signUp = async (formData: FormData) => {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/signup?error=" + error.message);
    }

    return redirect("/login?message=Check your email to confirm your account");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <Input
          name="email"
          placeholder="you@example.com"
          required
        />

        <label className="text-md" htmlFor="password">
          Password
        </label>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button
          formAction={signUp}
          className="bg-primary rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign Up
        </Button>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
