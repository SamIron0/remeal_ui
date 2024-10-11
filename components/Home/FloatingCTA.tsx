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
          className="bg-white text-primary hover:bg-gray-100 hover:text-primary-dark"
        >
          Get Started
        </Button>
      </Link>
    </motion.div>
  );
}
