import Search from "@/components/SearchPage/Search";
import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import SEOMetaTags from "@/components/SEOMetaTags";
import { Recipe } from "@/types";

type Props = {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug ? params.slug.join(" ") : "";
  let url = slug;

  const supabase = createClient(cookies());
  const { data: pageMetadata } = await supabase
    .from("page_metadata")
    .select("*")
    .eq("url", url)
    .single();

  let initialRecipes: Recipe[] = [];

  if (pageMetadata) {
    return {
      title: pageMetadata.title,
      description: pageMetadata.description,
      keywords: pageMetadata.keywords,
      other: {
        initialIngredients: pageMetadata.ingredients || [],
        initialRecipeIds: pageMetadata.recipe_ids || [],
      },
    };
  }

  // Fallback to default metadata if no pre-computed data is found
  return {
    title: "Recipe Search",
    description:
      "Find delicious recipes based on ingredients you have in your kitchen.",
    keywords: [],
    other: {
      initialIngredients: [],
      initialRecipeIds: [],
    },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const slug = params.slug ? params.slug.join(" ") : "";
  const url = process.env.NEXT_PUBLIC_URL + "/search/" + slug;
  const supabase = createClient(cookies());
  const metadata = await generateMetadata(
    { params, searchParams },
    {} as ResolvingMetadata
  );
  const initialRecipeIds = metadata.other?.initialRecipeIds as number[];
  const initialIngredients = metadata.other?.initialIngredients as string[];

  const { data: initialRecipes } = await supabase
    .from("recipes")
    .select(`
      *,
      nutrition_info(*),
      recipe_ingredients(
        quantity,
        unit,
        ingredients(name)
      )
    `)
    .in("id", initialRecipeIds);

  // Tag each recipe with matched ingredients
  const taggedInitialRecipes = initialRecipes?.map(recipe => ({
    ...recipe,
    matchedIngredients: initialIngredients.filter(ingredient =>
      recipe.recipe_ingredients?.some(ri =>
        ri.ingredients?.name?.toLowerCase().includes(ingredient.toLowerCase())
      )
    )
  }));

  return (
    <div className="">
      <SEOMetaTags
        title={metadata.title as string}
        description={metadata.description as string}
        canonicalUrl={url}
        keywords={metadata.keywords as string[]}
      />
      <div className=" px-4 md:px-6 mx-auto py-8">
        <Search
          initialIngredients={initialIngredients}
          initialRecipes={taggedInitialRecipes as Recipe[]}
        />
      </div>
    </div>
  );
}
