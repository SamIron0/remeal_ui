"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FloatingCTA() {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <Link href="/signup">
        <Button
          size="lg"
          className="bg-primary-gradient hover:text-white/90 hover:shadow-primary "
        >
          Get Started
        </Button>
      </Link>
    </motion.div>
  );
}
