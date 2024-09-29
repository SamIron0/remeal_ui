"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, CreditCard, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { user, subscription } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Search", href: "/search" },
    { name: "Pricing", href: "/membership" },
  ];
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

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                {item.name}
              </Link>
            ))}
            {isLoggedIn || user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar_url || ""}
                          alt={user?.full_name || ""}
                        />
                        <AvatarFallback>
                          {user?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="flex-col items-start">
                      <div className="font-medium">{user?.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user?.email}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/membership" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Pricing</span>
                      </Link>
                    </DropdownMenuItem>
                    {subscription?.status !== "active" && (
                      <DropdownMenuItem asChild>
                        <Link href="/membership" className="cursor-pointer">
                          <Button className="w-full" variant="default">
                            Upgrade to Premium
                          </Button>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-primary">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary text-white hover:bg-primary-dark">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
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
            {!isLoggedIn && (
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
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
