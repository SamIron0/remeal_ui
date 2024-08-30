"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const router = useRouter();
  const { user, supabase } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-xl font-bold">
        Remeal
      </Link>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="mr-4">
              Login
            </Link>
            <Link href="/signup" className="mr-4">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
