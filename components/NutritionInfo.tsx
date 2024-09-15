import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NutritionInfoProps {
  nutritionInfo: any;
  isPremium: boolean;
}

const NutritionInfo: React.FC<NutritionInfoProps> = ({ nutritionInfo, isPremium }) => {
  if (!isPremium) {
    return (
      <div className="mt-2 bg-gray-100 p-2 rounded">
        <p className="text-sm mb-2">Upgrade to Premium to see nutrition information!</p>
        <Link href="/membership">
          <Button size="sm" className="w-full">Upgrade Now</Button>
        </Link>
      </div>
    );
  }

  if (!nutritionInfo) {
    return <p className="text-sm text-gray-500 mt-2">Nutrition information not available</p>;
  }

  return (
    <div className="text-sm mt-2">
      <strong>Nutrition:</strong> {nutritionInfo.calories} cal,
      {nutritionInfo.protein}g protein,
      {nutritionInfo.fat}g fat,
      {nutritionInfo.carbohydrates}g carbs
    </div>
  );
};

export default NutritionInfo;
