import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Login() {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?error=" + error.message);
    }
    return redirect("/dashboard");
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
          formAction={signIn}
          className="bg-primary rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign In
        </Button>
        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
