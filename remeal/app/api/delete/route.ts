import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'
import redis from '@/utils/redis'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const recipeId = parseInt(params.id)

  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)

    if (error) throw error

    await removeRecipeFromIndex(recipeId)

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function removeRecipeFromIndex(recipeId: number) {
  const supabase = createClient()
  await supabase.rpc('remove_recipe_from_index', { p_recipe_id: recipeId })

  // Update Redis
  const allKeys = await redis.keys('ingredient:*')
  for (const key of allKeys) {
    const recipes = await redis.get(key)
    if (recipes) {
      const recipeList = recipes.split(',')
      const updatedList = recipeList.filter(id => id !== recipeId.toString())
      if (updatedList.length > 0) {
        await redis.set(key, updatedList.join(','))
      } else {
        await redis.del(key)
      }
    }
  }
}
