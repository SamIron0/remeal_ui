import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/client'

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, ingredients, instructions')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
