'use client';
import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { name: 'Recipe Search', free: true, premium: true },
  { name: 'Basic Ingredient Matching', free: true, premium: true },
  { name: 'Save Favorite Recipes', free: true, premium: true },
  { name: 'Advanced Filters', free: false, premium: true },
  { name: 'Personalized Recommendations', free: false, premium: true },
  { name: 'Meal Planning', free: false, premium: true },
  { name: 'Nutritional Information', free: false, premium: true },
];

const FeatureComparison: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left">Feature</th>
            <th className="p-4 text-center">Free</th>
            <th className="p-4 text-center">Premium</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="p-4">{feature.name}</td>
              <td className="p-4 text-center">
                {feature.free ? <Check className="inline-block text-green-500" /> : <X className="inline-block text-red-500" />}
              </td>
              <td className="p-4 text-center">
                {feature.premium ? <Check className="inline-block text-green-500" /> : <X className="inline-block text-red-500" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8 text-center">
        <Button size="lg" className="bg-primary text-white hover:bg-primary-dark">
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
};

export default FeatureComparison;
