import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Signup() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/search");
  }

  const signUp = async (formData: FormData) => {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/membership`,
      },
    });

    if (error) {
      return redirect("/signup?error=" + error.message);
    }

    if (!user.user?.id) {
      return redirect("/signup?error=User ID not found");
    }

    // Redirect to a success page after successful signup
    return redirect("/signup?success=true");
  };

  // Check for success message in URL

  const searchParams = headers().get("x-url-search-params");
  const success = searchParams?.includes("success=true");
  const error = searchParams
    ? new URLSearchParams(searchParams).get("error")
    : null;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <Input name="email" placeholder="you@example.com" required />

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
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            {" "}
            Please check your email for a verification link.
          </span>
        </div>
      )}
    </div>
  );
}
