from flask import Flask, request, jsonify
from recipe_index import search_recipes
from flask_lambda import FlaskLambda

app = FlaskLambda(__name__)

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    if not data or 'ingredients' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    ingredients = data['ingredients']
    max_results = data.get('max_results', 10)

    try:
        results = search_recipes(ingredients, max_results)
        return jsonify({'recipes': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Lambda handler
def lambda_handler(event, context):
    return app.handle_request(event, context)
