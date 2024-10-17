"use client";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    <section className="w-full  h-screen relative overflow-hidden text-white">
      <div className="relative flex flex-col items-center justify-center h-full text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl text-gradient font-bold tracking-tight sm:text-6xl md:text-7xl mb-6"
        >
          Cook Smart, Waste Less
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-muted-foreground md:text-2xl mb-12"
        >
          Find recipes based on the ingredients in your kitchen.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex w-full max-w-md gap-2 items-center"
          onSubmit={handleSubmit}
        >
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="flex-grow text-[16px] text-primary"
            required
          />
          <Button
            type="submit"
            className="bg-primary-gradient px-3 py-5 hover:shadow-accent "
          >
            Get Started
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
