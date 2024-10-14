"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Search, Home, Info, CreditCard, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { user, subscription } = useApp();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [menuItems, setMenuItems] = useState<{ name: string; href: string; icon: React.ReactNode }[]>(
    []
  );

  useEffect(() => {
    setMenuItems([
      { name: "Recipe Search", href: "/search", icon: <Search className="w-4 h-4 mr-2" /> },
      { name: "Home page", href: "/", icon: <Home className="w-4 h-4 mr-2" /> },
      { name: "How it works", href: "/#how-it-works", icon: <Info className="w-4 h-4 mr-2" /> },
      { name: "Pricing", href: "/membership", icon: <CreditCard className="w-4 h-4 mr-2" /> },
      ...(user ? [{ name: "Profile", href: "/profile", icon: <User className="w-4 h-4 mr-2" /> }] : []),
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
    <nav className="fixed z-10 top-0 left-0 w-full bg-background shadow-sm backdrop-blur-[12px] transition-all duration-300">
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
            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-gray-200 focus:outline-none"
              initial={false}
              animate={isMenuOpen ? "open" : "closed"}
            >     
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="block h-6 w-6 mt-1.5 ml-1"
              >
                <motion.path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" },
                  }}
                />
                <motion.path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M 2 9.423 L 20 9.423"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  transition={{ duration: 0.1 }}
                />
                <motion.path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" },
                  }}
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mx-auto sm:px-6 lg:px-8">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex hover:bg-gray-200 items-center justify-between text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                <div className="flex items-center w-full justify-between">
                  {item.name}
                  {item.icon}
                </div>
              </Link>
            ))}
            {user == null ? (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={toggleMenu}>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-gray-200 hover:text-primary items-center text-left text-primary"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={toggleMenu}>
                  <Button className="w-full bg-primary text-white hover:bg-primary-dark">
                    Sign Up
                  </Button>
                </Link>
              </div>
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
