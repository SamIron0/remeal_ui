const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  const { email, name } = await req.json();
  const customer = await stripe.customers.create({
    email: email,
  });

  return new Response(JSON.stringify(customer), { status: 200 });
}
