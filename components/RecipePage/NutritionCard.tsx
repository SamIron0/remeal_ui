import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NutritionCard({ nutritionInfo }: { nutritionInfo: any }) {
  if (!nutritionInfo) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionInfo.calories || 'N/A'}</p>
            <p className="text-sm text-gray-500">Calories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionInfo.protein ? `${nutritionInfo.protein}g` : 'N/A'}</p>
            <p className="text-sm text-gray-500">Protein</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionInfo.fat ? `${nutritionInfo.fat}g` : 'N/A'}</p>
            <p className="text-sm text-gray-500">Fat</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{nutritionInfo.carbohydrates ? `${nutritionInfo.carbohydrates}g` : 'N/A'}</p>
            <p className="text-sm text-gray-500">Carbs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
