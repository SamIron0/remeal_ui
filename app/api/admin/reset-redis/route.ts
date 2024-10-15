import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redis } from "@/utils/redis";
import {  getRecipesFromSupabase } from "@/utils/supabase/search";

export async function POST() {
  try {
    const supabase = createClient(cookies());
    const keys = await redis.keys("*");

    for (const key of keys) {
      const ingredients = key.split(",");
      const results = await getRecipesFromSupabase(ingredients);
      console.log("results", results);
      const response = await redis.set(key, JSON.stringify(results));
    }

    return NextResponse.json({
      message: "Redis cache reset successfully and page metadata updated",
    });
  } catch (error: any) {
    console.error("Error resetting Redis cache:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
