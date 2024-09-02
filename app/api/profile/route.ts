import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function PUT(request: Request) {
  const supabase = createClient(cookies());
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const { full_name, bio, dietary_preferences, notification_settings, language, avatar_url } = body;

  const { data, error } = await supabase
    .from('users')
    .update({
      full_name,
      bio,
      dietary_preferences,
      notification_settings,
      language,
      avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.user.id)
    .select();

  if (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}
