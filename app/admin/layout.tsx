import Link from "next/link";
import React from "react";
import { Home, Book, Users, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <Link
            href="/admin/dashboard"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            <Home className="mr-2" size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/recipes"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            <Book className="mr-2" size={20} />
            Manage Recipes
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
