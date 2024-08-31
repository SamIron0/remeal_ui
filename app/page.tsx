
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Search from "@/components/Search";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FAQSection from "@/components/FAQ";
import FeatureComparison from "@/components/FeatureComparison";
import AnimatedStats from "@/components/AnimatedStats";
import ParallaxHero from "@/components/ParallaxHero";
import AnimatedFeature from "@/components/AnimatedFeature";
import AnimatedStep from "@/components/AnimatedStep";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section with Parallax */}
      <ParallaxHero />

      {/* Animated Stats Section */}
      <AnimatedStats />

      {/* Feature Highlights */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-primary">
            Why Choose Remeal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Recipe Matching",
                description: "Our advanced algorithm finds the perfect recipes based on your available ingredients.",
                icon: "🧠",
              },
              {
                title: "Reduce Food Waste",
                description: "Use up ingredients before they spoil, saving money and reducing environmental impact.",
                icon: "🌱",
              },
              {
                title: "Personalized Recommendations",
                description: "Get recipe suggestions tailored to your dietary preferences and cooking habits.",
                icon: "👤",
              },
            ].map((feature, index) => (
              <AnimatedFeature key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full py-20 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            How Remeal Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Enter Your Ingredients", description: "List the ingredients you have on hand." },
              { step: 2, title: "Get Matched Recipes", description: "Our system finds recipes that match your ingredients." },
              { step: 3, title: "Start Cooking", description: "Follow the recipe and enjoy your delicious meal!" },
            ].map((step, index) => (
              <AnimatedStep key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Search Demo */}
      <section className="w-full py-20 bg-gray-100">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-primary">
            Try It Now
          </h2>
          <Search />
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-primary">
            What Our Users Say
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="w-full py-20 bg-gray-100">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-primary">
            Choose Your Plan
          </h2>
          <FeatureComparison />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="w-full py-20 bg-primary text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to Transform Your Cooking Experience?
          </h2>
          <p className="mx-auto max-w-[700px] text-xl text-gray-200 mb-8">
            Join Remeal today and discover a world of culinary possibilities right in your kitchen.
          </p>
          <FloatingCTA />
        </div>
      </section>
    </div>
  );
}
