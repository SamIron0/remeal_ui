# Remeal UI

Remeal is an intelligent recipe companion that suggests recipes based on available ingredients.

## Project Structure

remeal is composed of 3 parts:

- [remeal_ui](https://github.com/SamIron0/remeal_ui), is the frontend of this application which is available in this repository.
- [remeal_ingestion](https://github.com/SamIron0/remeal_ingestion), is a microservice that takes in a recipe, normalizes its ingredients, saves the recipe and indexes its ingredients for fast search.
- [remeal_generation](https://github.com/SamIron0/remeal_generation), generates standardized recipes using open source models. It reads a txt of recipe titles and generated those recipes.

## Features

- Ingredient Matching
- Recipe Filtering
- Nutritional Information
- User Authentication
- Saved Recipes
- Admin Dashboard

## Getting Started

### Prerequisites

- Next.js (version 18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables (refer to `.env.example` if available).

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Key Components

- Search Page: Allows users to find recipes based on ingredients
- Recipe Page: Displays detailed recipe information
- Admin Dashboard: Manages recipes,seo settings and views site metrics

## Deployment

The project is configured for deployment on Vercel.

## License

This project is licensed under the [MIT License](LICENSE).
