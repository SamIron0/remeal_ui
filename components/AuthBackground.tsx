import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  { icon: "🔍", title: "Smart Recipe Search" },
  { icon: "🥕", title: "Ingredient Matching" },
  { icon: "📅", title: "Meal Planning" },
  { icon: "📊", title: "Nutritional Info" },
];

const testimonials = [
  { text: "Remeal has revolutionized my cooking!", author: "Sarah K." },
  { text: "I've reduced my food waste significantly!", author: "Mike T." },
  { text: "The recipe suggestions are always spot-on!", author: "Emily R." },
];

const recipeImages = [
  "/images/recipe1.jpg",
  "/images/recipe2.jpg",
  "/images/recipe3.jpg",
];

export default function AuthBackground() {
  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden">
    

      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-medium mb-8"
        >
          Welcome to Remeal
        </motion.div>

        <div className="space-y-12">
          {/* Features section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center space-x-3 bg-white bg-opacity-10 rounded-lg p-3"
              >
                <span className="text-3xl">{feature.icon}</span>
                <span className="text-lg font-semibold">{feature.title}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonials section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white bg-opacity-5 rounded-lg p-6"
          >
            <h3 className="text-2xl font-semibold mb-4">What our users say:</h3>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="mb-3 italic text-gray-300"
              >
                "{testimonial.text}" -{" "}
                <span className="font-medium text-white">
                  {testimonial.author}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
