import Search from "@/components/SearchPage/Search";
import TestimonialCarousel from "@/components/Homepage/TestimonialCarousel";
import FAQSection from "@/components/Homepage/FAQ";
import FeatureComparison from "@/components/Homepage/FeatureComparison";
import AnimatedStats from "@/components/Homepage/AnimatedStats";
import ParallaxHero from "@/components/Homepage/ParallaxHero";
import AnimatedFeature from "@/components/Homepage/AnimatedFeature";
import AnimatedStep from "@/components/Homepage/AnimatedStep";
import FloatingCTA from "@/components/Homepage/FloatingCTA";

export default function Home() {
  return (
    <div className="flex flex-col w-full items-center">
      <ParallaxHero />

      <AnimatedStats />

      <section className="w-full py-20 bg-white">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-12 text-primary">
            Why Choose Remeal?
          </h1>
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
