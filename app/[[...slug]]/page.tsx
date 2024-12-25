import Search from "@/components/SearchPage/Search";
import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import SEOMetaTags from "@/components/SEOMetaTags";

type Props = {
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug ? params.slug.join(" ") : "";
  const defaultMetadata = {
    title: "Recipe Search",
    description:
      "Find delicious recipes based on ingredients you have in your kitchen.",
    keywords: [],
  };
  if (!slug) {
    return defaultMetadata;
  }

  const supabase = createClient(cookies());
  const { data: pageMetadata } = await supabase
    .from("search_page_metadata")
    .select("*")
    .eq("url", slug)
    .single();

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

  return defaultMetadata;
}

export default async function SearchPage({ params, searchParams }: Props) {
  const slug = params.slug ? params.slug.join(" ") : "";
  const url = process.env.NEXT_PUBLIC_URL + "/" + slug;
  const metadata = await generateMetadata(
    { params, searchParams },
    {} as ResolvingMetadata
  );

  let initialRecipeIds: number[] = [];
  let initialRecipes: any[] = [];
  let initialIngredients: string[] = [];

  const supabase = createClient(cookies());
  initialRecipeIds = metadata.other?.initialRecipeIds as number[];
  initialIngredients = metadata.other?.initialIngredients as string[];

  if (initialRecipeIds && initialRecipeIds.length > 0) {
    const { data: recipes } = await supabase
      .from("recipes")
      .select(
        `
          *,
          nutrition_info(*),
          recipe_ingredients(
            quantity,
            unit,
            ingredients(name)
          )
        `
      )
      .in("id", initialRecipeIds);

    initialRecipes =
      recipes?.map((recipe) => ({
        ...recipe,
        matchedIngredients: initialIngredients.filter((ingredient) =>
          recipe.recipe_ingredients?.some((ri) =>
            ri.ingredients?.name
              ?.toLowerCase()
              .includes(ingredient.toLowerCase())
          )
        ),
      })) || [];
  }

  return (
    <div className="w-full">
      <SEOMetaTags
        title={metadata.title as string}
        description={metadata.description as string}
        canonicalUrl={url}
        keywords={metadata.keywords as string[]}
      />
      <div className="w-full px-4 md:px-6 mx-auto py-8">
        <Search
          initialIngredients={initialIngredients}
          initialRecipes={initialRecipes}
        />
      </div>
    </div>
  );
}
