import { GetCurrentUserFromMongoDB } from "@/actions/users";
import PageTitle from "@/components/page-title";
import prisma from "@/config/db";
import { currentUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import React from "react";
import { subscriptionPlans } from "@/constants"; // Import your plan details

async function Account() {
  const clerkUser = await currentUser();
  const mongoUser = await (await GetCurrentUserFromMongoDB()).data;
  const propertiesCount = await prisma.property.count({
    where: { userId: mongoUser?.id },
  });

  // Fetch user subscription details
  const userSubscription = await prisma.subscription.findFirst({
    where: { userId: mongoUser?.id },
    orderBy: { createdAt: "desc" },
  });

  // Find the matching plan details from the subscriptionPlans array
  const planDetails = userSubscription?.plan
  ? subscriptionPlans.find(
      (plan) => plan.name.toLowerCase() === String(userSubscription.plan).toLowerCase()
    )
  : null;


  // Determine if subscription is expired
  const isExpired =
    userSubscription?.expiresAt &&
    dayjs().isAfter(dayjs(userSubscription.expiresAt));

  const getSectionTitle = (title: string) => (
    <div>
      <h1 className="text-xl font-bold text-gray-500">{title}</h1>
      <hr className="border-gray-300 my-2 border-solid" />
    </div>
  );

  const getAttribute = (title: string, value: string | number) => (
    <div className="flex flex-col text-sm">
      <span className="text-gray-900 font-semibold">{title}</span>
      <span className="text-gray-700">{value || "N/A"}</span>
    </div>
  );

  return (
    <div>
      <PageTitle title="My Account" />

      <div className="flex flex-col gap-5">
        {getSectionTitle("Basic Details")}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {getAttribute("Name", mongoUser?.username || "")}
          {getAttribute("Email", mongoUser?.email || "")}
          {getAttribute("Clerk User Id", mongoUser?.clerkUserId || "")}
          {getAttribute(
            "Registered On",
            dayjs(mongoUser?.createdAt).format("DD MMM YYYY hh:mm A") || ""
          )}
          {getAttribute(
            "Last Login",
            dayjs(clerkUser?.lastSignInAt).format("DD MMM YYYY hh:mm A") || ""
          )}
          {getAttribute("Properties Posted", propertiesCount.toString())}
        </div>
      </div>

      <div className="flex flex-col gap-5 mt-10">
        {getSectionTitle("Subscription Details")}

        {userSubscription ? (
          <div className="grid grid-cols-3 gap-5">
            {getAttribute("Plan", planDetails?.name || "No Plan")}
            {getAttribute("Price", `₹ ${planDetails?.price || 0}`)}
            {getAttribute(
              "Purchased On",
              dayjs(userSubscription?.createdAt).format("DD MMM YYYY hh:mm A") || ""
            )}
            {getAttribute("Payment Id", userSubscription?.paymentId || "")}
            {getAttribute(
              "Expires On",
              dayjs(userSubscription?.expiresAt).format("DD MMM YYYY hh:mm A")
            )}
            {isExpired &&
              getAttribute("Status", "Expired - Please Renew Subscription")}
          </div>
        ) : (
          <div className="text-center">No subscription found</div>
        )}
      </div>
    </div>
  );
}

export default Account;
