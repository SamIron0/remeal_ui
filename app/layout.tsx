import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/supabase/types";
import Navigation from "@/components/Navbar/Navigation";
import { AppProvider } from "@/context/AppContext";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cn } from "@/lib/utils";

const defaultUrl = "https://remeal.xyz";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Remeal | Recipe Finder",
    template: "%s | Remeal",
  },
  description:
    "Remeal is a modern recipe search engine that lets you find the best recipes based on ingredients you have in your fridge. We use AI to match your ingredients to the best recipes for you and give you the best cooking suggestions. Remeal turns your fridge into a smart assistant that helps you cook better and waste less food. We have a wide variety of recipes including Chinese, Italian, Mexican, Mediterranean, and Indian & Thai cuisines. You'll find dishes for every occasion, from Breakfast to Dinner, Quick & Easy meals to Slow Cooker recipes. Our collection covers Breads, Cakes, Casseroles, Dips, Drinks, Fish recipes, Grilling & BBQ,  Meat recipes, Poultry recipes,  Salads, Sandwiches, Sauces, Seafood recipes, Slow Cooker, Soups and more.",
  keywords: [
    "tonight",
    "home",
    "finder",
    "breakfast",
    "grocery",
    "recipe",
    "search engine",
    "fridge",
    "meal",
    "ingredients",
    "pantry",
    "food",
    "kitchen",
    "dinner",
    "dinner ideas",
    "dessert",
    "entree",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    siteName: "Remeal",
    title: "Remeal | Find recipes with ingredients in your fridge",
    description:
      "Remeal is a modern recipe search engine that lets you find the best recipes based on ingredients you have in your fridge. We use AI to match your ingredients to the best recipes for you and give you the best cooking suggestions. Remeal turns your fridge into a smart assistant that helps you cook better and waste less food.",
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Remeal | Find recipes with ingredients in your fridge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@re_meal",
    creator: "@re_meal",
    title: "Remeal - Recipe Finder",
    description: "Discover recipes, reduce food waste.",
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#f7f7f7" />
      </head>
      <GoogleAnalytics gaId="G-8VB6GS4GD1" />
      <body className=" text-foreground bg-background antialiased">
        <AppProvider>
          <SpeedInsights />
          <Navigation />
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
