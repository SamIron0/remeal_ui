"use client";
import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Newsletter signup submitted");
  };

  return (
    <footer className="bg-gray-100 text-gray-600 border-t border-gray-200 pt-8 pb-8">
      <div className="container mx-auto px-4">
        <p className="text-sm">
            &copy; {new Date().getFullYear()} Remeal. All rights reserved.
          </p>
      </div>
    </footer>
  );
};

export default Footer;
