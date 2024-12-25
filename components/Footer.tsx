"use client";
import React from "react";
import Link from "next/link";
import { XLogo } from "./icons/Xlogo";

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
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Remeal. All rights reserved.
          </p>
          <a href="https://x.com/csi0x" target="_blank" rel="noopener noreferrer" className="mt-4 md:mt-0">
            <XLogo className="w-6 h-6 text-gray-600 hover:text-primary" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
