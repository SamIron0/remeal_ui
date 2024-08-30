import Link from "next/link";
import { Button } from "@/components/ui/button";
import Search from "@/components/Search";

export default function Home() {
  return (
    <div className="flex fle  x-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Cook Delicious Meals with What You Have
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                Remeal helps you discover recipes based on the ingredients in your kitchen. Say goodbye to food waste and hello to culinary creativity!
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Get Started</Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Why Choose Remeal?</h2>
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
              <div key={index} className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">How Remeal Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Enter Your Ingredients", description: "List the ingredients you have on hand." },
              { step: 2, title: "Get Matched Recipes", description: "Our system finds recipes that match your ingredients." },
              { step: 3, title: "Start Cooking", description: "Follow the recipe and enjoy your delicious meal!" },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Search Demo */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Try It Now</h2>
          <Search />
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah L.", quote: "Remeal has revolutionized my meal planning. I waste less food and enjoy cooking more!" },
              { name: "Mike T.", quote: "As a busy professional, Remeal helps me whip up quick meals with whatever I have in the fridge." },
              { name: "Emily R.", quote: "The personalized recommendations are spot-on. Remeal knows my taste better than I do!" },
            ].map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-lg shadow-md">
                <p className="text-lg mb-4">"{testimonial.quote}"</p>
                <p className="font-bold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-6">
            Ready to Transform Your Cooking Experience?
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl mb-8">
            Join Remeal today and discover a world of culinary possibilities right in your kitchen.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Get Started for Free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}