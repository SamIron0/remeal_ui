import psycopg2
from recipe_index import index_recipe, normalize_ingredient
import json
pg_conn = psycopg2.connect("dbname=recipes user=user password=pass")
def lambda_handler(event, context):
    try:
        recipe_data = json.loads(event['body'])
        recipe_id = ingest_recipe(recipe_data)
        return {
            'statusCode': 200,
            'body': json.dumps({'id': recipe_id})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    
def ingest_recipe(recipe_data):
    with pg_conn.cursor() as cur:
        # Insert recipe into the database
        cur.execute("""
            INSERT INTO recipes (name, instructions, ingredients)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (recipe_data['name'], recipe_data['instructions'], recipe_data['ingredients']))
        recipe_id = cur.fetchone()[0]
        
        # Index the recipe ingredients
        normalized_ingredients = [normalize_ingredient(ing) for ing in recipe_data['ingredients']]
        index_recipe(recipe_id, normalized_ingredients)
    
    pg_conn.commit()
    return recipe_id