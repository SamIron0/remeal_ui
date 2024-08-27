import Link from 'next/link';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <Link href="/admin" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/admin/recipes" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            Manage Recipes
          </Link>
          <Link href="/admin/ingredients" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            Manage Ingredients
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
