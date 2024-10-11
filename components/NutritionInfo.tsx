import React from "react";

interface NutritionInfoProps {
  nutritionInfo: any;
}

const NutritionInfo: React.FC<NutritionInfoProps> = ({ nutritionInfo }) => {

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
