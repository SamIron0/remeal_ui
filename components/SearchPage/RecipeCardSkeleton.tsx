import React from "react";

const   RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-lg p-4 animate-pulse space-y-4">
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      
      {/* Badge */}
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      
      {/* Ingredients */}
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
        <div className="h-4 bg-gray-200 rounded w-9/12"></div>
      </div>
      
      {/* Nutrition Info */}
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
