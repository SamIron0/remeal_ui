import { Checkbox } from "../ui/checkbox"

export default function IngredientList({ ingredients }: { ingredients: any[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-center">
            <Checkbox/>
            <span>
              {ingredient.quantity} {ingredient.unit} {ingredient.ingredients.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
