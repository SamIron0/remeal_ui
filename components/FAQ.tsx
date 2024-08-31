'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How does Remeal work?',
    answer: 'Remeal uses an advanced algorithm to match the ingredients you have with our database of recipes. Simply input the ingredients you have on hand, and we\'ll suggest delicious meals you can make!'
  },
  {
    question: 'Is Remeal free to use?',
    answer: 'Yes, Remeal offers a free basic version. We also have a premium version with additional features like advanced filters and personalized recommendations.'
  },
  {
    question: 'Can I add my own recipes to Remeal?',
    answer: 'Currently, recipe submission is not available for users. However, we\'re constantly updating our database with new recipes from professional chefs and food bloggers.'
  },
  {
    question: 'How often are new recipes added?',
    answer: 'We add new recipes to our database weekly, ensuring you always have fresh meal ideas!'
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md">
              <button
                className="flex justify-between items-center w-full p-4 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold">{faq.question}</span>
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openIndex === index && (
                <div className="p-4 pt-0">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
