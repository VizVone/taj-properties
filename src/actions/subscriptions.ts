"use server";

import prisma from "@/config/db";
import { GetCurrentUserFromMongoDB } from "./users";
import { addMonths, addYears, isAfter } from "date-fns";

// Function to save a subscription with expiry date
export const SaveSubscription = async ({
  paymentId,
  plan,
}: {
  paymentId: string;
  plan: "3-month" | "1-year";
}) => {
  try {
    const user = await GetCurrentUserFromMongoDB();
    
    if (!user?.data?.id) {
      return { error: "User not authenticated" };
    }

    // Get the latest subscription (if any) to check if it's active
    const latestSubscription = await prisma.subscription.findFirst({
      where: { userId: user.data.id },
      orderBy: { expiresAt: "desc" },
    });

    let startDate = new Date();
    
    // If the user already has an active subscription, extend from its expiration date
    if (latestSubscription && isAfter(latestSubscription.expiresAt, startDate)) {
      startDate = new Date(latestSubscription.expiresAt);
    }

    // Calculate expiration date based on the plan
    let expirationDate = plan === "3-month" ? addMonths(startDate, 3) : addYears(startDate, 1);

    // Save subscription in the database
    const newSubscription = await prisma.subscription.create({
      data: {
        paymentId,
        plan,
        userId: user.data.id,
        expiresAt: expirationDate, // Store expiration date
      },
    });

    return {
      message: "Subscription saved successfully",
      expiresAt: expirationDate,
    };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Function to check if a subscription is active
export const CheckSubscriptionStatus = async () => {
  try {
    const user = await GetCurrentUserFromMongoDB();

    if (!user?.data?.id) {
      return { isActive: false, expiresAt: null, plan: null };
    }

    // Fetch the latest subscription
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.data.id },
      orderBy: { expiresAt: "desc" },
    });

    if (!subscription) {
      return { isActive: false, expiresAt: null, plan: null };
    }

    const today = new Date();
    const isActive = subscription.expiresAt > today;

    return {
      isActive,
      expiresAt: subscription.expiresAt,
      plan: subscription.plan, // Ensure this returns the correct plan name
    };
  } catch (error: any) {
    return { error: error.message, isActive: false, expiresAt: null, plan: null };
  }
};

// Function to notify user when subscription expires
export const NotifySubscriptionExpiry = async () => {
  const { isActive, expiresAt } = await CheckSubscriptionStatus();

  if (!isActive && expiresAt) {
    return {
      message: "Your subscription has expired. Please renew to continue.",
      expired: true,
    };
  }

  return { expired: false };
};
