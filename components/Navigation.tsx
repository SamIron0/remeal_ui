"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useApp } from "@/context/AppContext";

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { user, subscription } = useApp();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [menuItems, setMenuItems] = useState<{ name: string; href: string }[]>(
    []
  );
  useEffect(() => {
    setMenuItems([
      { name: "Recipe Search", href: "/search" },
      { name: "Home page", href: "/" },
      { name: "How it works", href: "/#how-it-works" },
      { name: "Pricing", href: "/membership" },
      ...(user ? [{ name: "Profile", href: "/profile" }] : []),
    ]);
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      isLoggedIn = false;
      router.push("/search");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-semibold text-primary">
                Remeal
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            {user == null ? (
              <>
                <Link href="/login" onClick={toggleMenu}>
                  <Button
                    variant="ghost"
                    className="w-full text-left text-primary"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={toggleMenu}>
                  <Button className="w-full bg-primary text-white hover:bg-primary-dark">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {!subscription && (
                  <Link href="/membership">
                    <Button className="w-full bg-primary text-white hover:bg-primary-dark">
                      Upgrade to Premium
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleSignOut}
                  className="w-full bg-primary text-white hover:bg-primary-dark"
                >
                  Log Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
