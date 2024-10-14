import Search from "@/components/SearchPage/Search";
import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

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

  let title = "Recipe Search";
  let description =
    "Find delicious recipes based on ingredients you have in your kitchen.";
  let initialIngredients: string[] = [];
  if (decodedSlug) {
    const supabase = createClient(cookies());
    const { data: pageMetadata } = await supabase
      .from("page_metadata")
      .select("title, description,ingredients")
      .eq("url", url)
      .single();
    title = pageMetadata?.title || "Recipe Search";
    description =
      pageMetadata?.description ||
      "Find delicious recipes based on ingredients you have in your kitchen.";
    initialIngredients = pageMetadata?.ingredients || [];
  }

  return {
    title,
    description,
    other: {
      initialIngredients,
    },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const initialIngredients = searchParams.initialIngredients as string[];
  return (
    <div className="px-4 md:px-6 mx-auto py-8">
      <Search initialIngredients={initialIngredients} />
    </div>
  );
}
