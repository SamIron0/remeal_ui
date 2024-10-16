import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/supabase/types";
import Navigation from "@/components/Navigation";
import { AppProvider } from "@/context/AppContext";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cn } from "@/lib/utils";

const defaultUrl = "https://remeal.xyz";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Remeal | Recipe Finder App",
    template: "%s | Remeal",
  },
  description:
    "Find recipes you can easily make based on ingredients you already have in your kitchen. Get nutritional information and personalized recommendations.",
  keywords: [
    "recipe finder",
    "food waste reduction",
    "ingredients in your fridge",
    "ingredient-based recipes",
    "ingredients in your kitchen",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    siteName: "Remeal",
    title: "Remeal - Cook Smart, Waste Less | Recipe Finder App",
    description:
      "Discover delicious recipes based on ingredients you have in your kitchen. Reduce food waste and save money with Remeal's smart cooking suggestions.",
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Remeal - Cook Smart, Waste Less",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@remeal_app",
    creator: "@remeal_app",
    title: "Remeal - Cook Smart, Waste Less | Recipe Finder App",
    description:
      "Discover recipes, reduce food waste, and save money with Remeal's smart cooking suggestions.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={cn(GeistSans.className, "hide-scrollbar")}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#f7f7f7" />
      </head>
      <GoogleAnalytics gaId="G-8VB6GS4GD1" />
      <body className=" text-foreground bg-background antialiased">
        <AppProvider>
          <SpeedInsights />
          <Navigation isLoggedIn={!!user} />
          <main className="space-y-12 flex flex-col items-center">
            {children}
            <Toaster />
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
