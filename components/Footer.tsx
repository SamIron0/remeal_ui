"use client";
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background text-gray-600 border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Remeal</h3>
            <p className="text-sm ">
              Cook smart, waste less with Remeal - your intelligent recipe
              companion.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary">
                  Recipe Search
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Remeal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
