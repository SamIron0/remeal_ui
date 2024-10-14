'use client';
import { motion } from "framer-motion";

export default function AnimatedStep({ step, index }: { step: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.3 }}
      className="flex flex-col items-center text-center bg-primary-dark p-6 rounded-lg"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-400  text-primary flex items-center justify-center text-xl font-bold mb-4">
        {step.step}
      </div>
      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
      <p className="text-muted-foreground">{step.description}</p>
    </motion.div>
  );
}