import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

export default async function Login() {
  const supabase = createClient(cookies());
  const session = await supabase.auth.getSession();
  if (session.data.session) {
    return redirect("/dashboard");
  }
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
      const loginUrl = "/login";
      const callbackParam = "";
      return redirect(`${loginUrl}${callbackParam}&message=${error.message}`);
    }
    return redirect("/dashboard");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />

        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button
          formAction={signIn}
          className="bg-primary rounded-md px-4 py-2 text-foreground mb-7"
        >
          Sign In
        </Button>
        <p className="text-sm font-light text-zinc-500">
          Don&apos;t have an account?{" "}
          <a
            href={`/signup`}
            className="font-medium hover:underline text-primary-500 mb-3"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
