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
  let url = process.env.NEXT_PUBLIC_URL + "/search/" + slug;
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");

  const supabase = createClient(cookies());
  const { data: pageMetadata } = await supabase
    .from("page_metadata")
    .select("*")
    .eq("url", url)
    .single();

  if (pageMetadata) {
    return {
      title: pageMetadata.title,
      description: pageMetadata.description,
      keywords: pageMetadata.keywords,
      other: {
        initialIngredients: pageMetadata.ingredients || []  ,
      },
    };
  }

  // Fallback to default metadata if no pre-computed data is found
  return {
    title: "Recipe Search",
    description: "Find delicious recipes based on ingredients you have in your kitchen.",
    keywords: [],
    other: {
      initialIngredients: [],
    },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const supabase = createClient(cookies());
  const slug = params.slug ? params.slug.join(" ") : "";
  let url = process.env.NEXT_PUBLIC_URL + "/search/" + slug;

  const { data: pageMetadata } = await supabase
    .from("page_metadata")
    .select("*")
    .eq("url", url)
    .single();

  let initialRecipes: Recipe[] = [];
  if (pageMetadata && pageMetadata.recipe_ids) {
    const { data: recipes } = await supabase
      .from("recipes")
      .select("*")
      .in("id", pageMetadata.recipe_ids);
    initialRecipes = recipes || []
  }

  const metadata = await generateMetadata({ params, searchParams }, {} as ResolvingMetadata);

  return (
    <>
      <SEOMetaTags
        title={metadata.title as string}
        description={metadata.description as string}
        canonicalUrl={url}
        keywords={metadata.keywords as string[]}
      />
      <div className="px-4 md:px-6 mx-auto py-8">
        <Search initialIngredients={pageMetadata?.ingredients || []} initialRecipes={initialRecipes} />
      </div>
    </>
  );
}
