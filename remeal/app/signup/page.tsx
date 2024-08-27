import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Signup({
  searchParams,
}: {
  searchParams: {
    message: string;
    role: "driver" | "rider";
    callbackUrl: string;
  };
}) {
  const supabase = createClient(cookies());
  const session = await supabase.auth.getSession();
  if (session.data.session) {
    return redirect("/dashboard");
  }
  const signUp = async (formData: FormData) => {
    "use server";
    const cookieStore = cookies();

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = searchParams.role;
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      const signupUrl =
        role === "driver" ? "/signup?role=driver" : "/signup?role=rider";
      const callbackParam = searchParams.callbackUrl
        ? `&callbackUrl=${searchParams.callbackUrl}`
        : "";
      return redirect(`${signupUrl}${callbackParam}&message=${error.message}`);
    }
    const setupUrl =
      role === "driver" ? "/setup?role=driver" : "/setup?role=rider";
    const callbackParam = searchParams.callbackUrl
      ? `&callbackUrl=${searchParams.callbackUrl}`
      : "";
    return redirect(`${setupUrl}${callbackParam}`);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <Label className="text-md" htmlFor="email">
          Email
        </Label>
        <Input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <Label className="text-md" htmlFor="password">
          Password
        </Label>
        <Input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 bg-primary text-foreground mb-7"
        >
          Sign Up
        </Button>
        <p className="text-sm font-light text-zinc-500">
          Already have an account?{" "}
          <a
            href={`/login?${
              searchParams.role ? `role=${searchParams.role}` : ""
            }${
              searchParams.callbackUrl
                ? `&callbackUrl=${searchParams.callbackUrl}`
                : ""
            }`}
            className="font-medium hover:underline"
          >
            Login
          </a>
        </p>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
