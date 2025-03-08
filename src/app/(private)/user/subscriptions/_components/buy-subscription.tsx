"use client";
import { Button, message } from "antd";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { GetStripeClientSecret } from "@/actions/payments";
import CheckoutForm from "./checkout-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function BuySubScription({ plan, isActive }: { plan: any, isActive: boolean }) {
  const [clientSecret, setClientSecret] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showCheckoutForm, setShowCheckoutForm] =
    React.useState<boolean>(false);

  const getClientSecret = async () => {
    try {
      setLoading(true);
      const response = await GetStripeClientSecret(plan.price);
      if (response.error) throw new Error(response.error);
      setClientSecret(response.clientSecret);
      setShowCheckoutForm(true);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        block
        disabled={isActive || plan.price === 0}  // Disable the button if the plan is active
        onClick={getClientSecret}
        loading={loading}
      >
        {isActive ? "Active Subscription" : "Buy Now"}
      </Button>

      {clientSecret && showCheckoutForm && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret,
          }}
        >
          <CheckoutForm
            showCheckoutForm={showCheckoutForm}
            setShowCheckoutForm={setShowCheckoutForm}
            plan={plan}
          />
        </Elements>
      )}
    </div>
  );
}

export default BuySubScription;
