import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NutritionCard({ nutritionInfo }: { nutritionInfo: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionInfo.calories}</p>
            <p className="text-sm text-gray-500">Calories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionInfo.protein}g</p>
            <p className="text-sm text-gray-500">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionInfo.fat}g</p>
            <p className="text-sm text-gray-500">Fat</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionInfo.carbohydrates}g</p>
            <p className="text-sm text-gray-500">Carbs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
