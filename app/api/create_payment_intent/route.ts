// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items: any) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

const chargeCustomer = async (customerId: string) => {
  try {
    // Lookup the payment methods available for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    // Charge the customer and payment method immediately
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "eur",
      customer: customerId,
      payment_method: paymentMethods.data[0].id,
      off_session: true,
      confirm: true,
    });
  } catch (err: any) {
    // Error code will be authentication_required if authentication is needed
    console.error("Error in chargeCustomer:", err);
    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
      err.raw.payment_intent.id
    );
    console.log("PI retrieved: ", paymentIntentRetrieved.id);
  }
};

export async function POST(req: Request, res: Response) {
  try {
    const { items } = await req.json();
    // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
    // and attach the PaymentMethod to a new Customer
    console.log("Creating customer");
    const customer = await stripe.customers.create();
    console.log("Customer created");

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      setup_future_usage: "off_session",
      amount: calculateOrderAmount(items),
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      })
    );
  } catch (error: any) {
    console.error("Error in create_payment_intent:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing the payment." }),
      { status: 500 }
    );
  }
}
