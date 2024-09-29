# Remeal UI

Remeal UI is the frontend application for Remeal, an intelligent recipe companion that helps users cook smart and waste less food.

## Features

- Ingredient Matching
- Recipe Filtering
- Nutritional Information
- User Authentication
- Premium Subscription Management
- Saved Recipes
- Admin Dashboard

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Supabase
- Stripe (for payments)

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
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

## Project Structure

- `/app`: Next.js app router pages and API routes
- `/components`: Reusable React components
- `/utils`: Utility functions and helpers
- `/context`: React context providers
- `/types`: TypeScript type definitions
- `/public`: Static assets

## Key Components

- Search Page: Allows users to find recipes based on ingredients
- Recipe Page: Displays detailed recipe information
- Pricing Page: Shows subscription options for premium features
- Admin Dashboard: Manages recipes and views site metrics

## Styling

The project uses Tailwind CSS for styling. Custom components are built using the shadcn/ui library.

## API Integration

The UI interacts with backend services for recipe matching, user management, and subscription handling.

## Deployment

The project is configured for deployment on Vercel.

## License

This project is licensed under the [MIT License](LICENSE).
