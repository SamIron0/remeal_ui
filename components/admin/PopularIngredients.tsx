'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PopularIngredients({ ingredients }: { ingredients: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Ingredients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredient</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient: any) => (
              <TableRow key={ingredient.name}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
