import PageTitle from "@/components/page-title";
import { subscriptionPlans } from "@/constants";
import React from "react";
import BuySubScription from "./_components/buy-subscription";
import prisma from "@/config/db";
import { GetCurrentUserFromMongoDB } from "@/actions/users";

async function SubscriptionsPage() {
  // Get the current logged-in user
  const mongoUser = await (await GetCurrentUserFromMongoDB()).data;

  // Fetch the user's subscription details
  const userSubscription: any = await prisma.subscription.findFirst({
    where: { userId: mongoUser?.id },
    orderBy: { createdAt: "desc" },
  });

  // If no subscription exists, we default to "Basic" plan
  const activePlanName = userSubscription?.plan || "Basic"; // For comparison, we use the plan name directly

  return (
    <div>
      <PageTitle title="Subscriptions" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subscriptionPlans.map((plan) => {
          // Adjust the comparison based on userSubscription's plan (3-month or 1-year)
          const isSelected = activePlanName.toLowerCase() === plan.name.toLowerCase();
          
          // Check if this plan is the active plan to disable the button
          const isActive = activePlanName.toLowerCase() === plan.name.toLowerCase();

          return (
            <div
              key={plan.name}
              className={`flex flex-col gap-5 justify-between p-5 border rounded-2xl border-solid
                ${isSelected ? "border-primary border-2" : "border-gray-300"}
              `}
            >
              <div className="flex flex-col gap-3">
                <h1 className="text-xl font-bold text-primary">{plan.name}</h1>
                <h1 className="text-orange-700 text-2xl lg:text-5xl font-bold">
                  ₹{plan.price}
                </h1>

                <hr />

                <div className="flex flex-col gap-1">
                  {plan.features.map((feature, index) => (
                    <span key={index} className="text-gray-500 text-sm">{feature}</span>
                  ))}
                </div>
              </div>

              {/* Pass isActive as a prop to disable the Buy button for the active plan */}
              <BuySubScription plan={plan} isActive={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SubscriptionsPage;
