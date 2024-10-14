import Link from "next/link";
import React from "react";
import { Home, Book, Search, BarChart } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: BarChart, label: "Dashboard" },
  { href: "/admin/recipes", icon: Book, label: "Manage Recipes" },
  { href: "/admin/seo", icon: Search, label: "SEO Management" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <aside className="w-full md:w-64 bg-white shadow-md">
        <div className="p-4">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="w-6 h-6" />
            <span className="text-xl font-bold">Remeal Admin</span>
          </Link>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
