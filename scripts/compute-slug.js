const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


async function updateSlugs() {
  try {
    // Fetch all records from recipe_page_metadata
    const { data, error } = await supabase
      .from('recipe_page_metadata')
      .select('recipe_id, title, slug');

    if (error) throw error;

    // Update slugs
    for (const record of data) {
      const newSlug = slugify(record.title);
      
      if (newSlug !== record.slug) {
        console.log(`Updating slug for recipe_id ${record.recipe_id}: ${newSlug}`);
        const { error: updateError } = await supabase
          .from('recipe_page_metadata')
          .update({ slug: newSlug })
          .eq('recipe_id', record.recipe_id);

        if (updateError) {
          console.error(`Error updating slug for recipe_id ${record.recipe_id}:`, updateError);
        } else {
          console.log(`Updated slug for recipe_id ${record.recipe_id}: ${newSlug}`);
        }
      }
    }

    console.log('Slug update process completed.');
  } catch (error) {
    console.error('Error in updateSlugs:', error);
  }
}

updateSlugs();

