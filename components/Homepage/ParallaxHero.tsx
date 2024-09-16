"use client";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ParallaxHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="w-full h-screen relative overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl mb-4"
        >
          Cook Smart, Waste Less
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-[700px] text-xl text-gray-200 md:text-2xl mb-8"
        >
          Discover recipes based on the ingredients in your kitchen.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex w-full max-w-md gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-primary"
            required
          />
          <Button type="submit" size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary-dark">
            Get Started
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
