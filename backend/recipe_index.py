import redis
import psycopg2
import os

def get_redis_client():
    redis_host = os.environ.get('REDIS_HOST', 'localhost')
    redis_port = int(os.environ.get('REDIS_PORT', 6379))
    return redis.Redis(host=redis_host, port=redis_port, db=0)

def get_pg_conn():
    pg_conn_string = os.environ.get('PG_CONN_STRING', "dbname=recipes user=user password=pass")
    return psycopg2.connect(pg_conn_string)

import re

def normalize_ingredient(ingredient):
    # Convert to lowercase
    normalized = ingredient.lower()
    # Remove plurals (simple s/es removal)
    normalized = re.sub(r'(s|es)$', '', normalized)
    # Remove special characters
    normalized = re.sub(r'[^\w\s]', '', normalized)
    # Remove extra whitespace
    normalized = ' '.join(normalized.split())
    return normalized

def search_recipes(ingredients, max_results=10):
    normalized_ingredients = [normalize_ingredient(ing) for ing in ingredients]
    
    # First, try Redis for exact matches
    recipe_sets = [set(get_redis_client().get(f"ingredient:{ing}").decode().split(','))
                   for ing in normalized_ingredients
                   if get_redis_client().exists(f"ingredient:{ing}")]
    
    if recipe_sets:
        matched_recipes = set.intersection(*recipe_sets)
        if matched_recipes:
            return list(matched_recipes)[:max_results]
    
    # If no exact matches, use PostgreSQL for fuzzy matching
    with get_pg_conn().cursor() as cur:
        placeholders = ','.join(['%s'] * len(normalized_ingredients))
        cur.execute(f"""
            SELECT recipe_ids
            FROM ingredient_index
            WHERE ingredient % ANY(ARRAY[{placeholders}])
            ORDER BY similarity(ingredient, ARRAY[{placeholders}]) DESC
        """, normalized_ingredients * 2)
        
        results = cur.fetchall()
        matched_recipes = set()
        for row in results:
            matched_recipes.update(row[0])
            if len(matched_recipes) >= max_results:
                break
    
    return list(matched_recipes)[:max_results]



def index_recipe(recipe_id, ingredients):
    with get_pg_conn().cursor() as cur:
        for ingredient in ingredients:
            normalized = normalize_ingredient(ingredient)

            # Update Redis
            redis_key = f"ingredient:{normalized}"
            if get_redis_client().exists(redis_key):
                get_redis_client().append(redis_key, f",{recipe_id}")
            else:
                get_redis_client().set(redis_key, str(recipe_id))

            # Update PostgreSQL
            cur.execute(
                """
                INSERT INTO ingredient_index (ingredient, recipe_ids)
                VALUES (%s, ARRAY[%s])
                ON CONFLICT (ingredient) 
                DO UPDATE SET recipe_ids = array_append(ingredient_index.recipe_ids, %s)
                WHERE NOT %s = ANY(ingredient_index.recipe_ids)
            """,
                (normalized, recipe_id, recipe_id, recipe_id),
            )

    get_pg_conn().commit()

def remove_recipe(recipe_id):
    with get_pg_conn().cursor() as cur:
        cur.execute("SELECT ingredient FROM ingredient_index WHERE %s = ANY(recipe_ids)", (recipe_id,))
        ingredients = [row[0] for row in cur.fetchall()]
        
        for ingredient in ingredients:
            # Update Redis
            redis_key = f"ingredient:{ingredient}"
            recipe_ids = get_redis_client().get(redis_key).decode().split(',')
            recipe_ids.remove(str(recipe_id))
            if recipe_ids:
                get_redis_client().set(redis_key, ','.join(recipe_ids))
            else:
                get_redis_client().delete(redis_key)
            
            # Update PostgreSQL
            cur.execute("""
                UPDATE ingredient_index
                SET recipe_ids = array_remove(recipe_ids, %s)
                WHERE ingredient = %s
            """, (recipe_id, ingredient))
        
        # Remove empty entries
        cur.execute("DELETE FROM ingredient_index WHERE recipe_ids = '{}'")
    
    get_pg_conn().commit()

def update_recipe(recipe_id, new_ingredients):
    remove_recipe(recipe_id)
    index_recipe(recipe_id, new_ingredients)

#TODO:  Run this function periodically (e.g., daily) to ensure Redis and PostgreSQL are in sync
def sync_redis_with_postgres():
    with get_pg_conn().cursor() as cur:
        cur.execute("SELECT ingredient, recipe_ids FROM ingredient_index")
        for ingredient, recipe_ids in cur.fetchall():
            redis_key = f"ingredient:{ingredient}"
            get_redis_client().set(redis_key, ','.join(map(str, recipe_ids)))
