"use server";
import prisma from "@/config/db";
import { currentUser } from "@clerk/nextjs";
import { message } from "antd";

export const GetCurrentUserFromMongoDB = async () => {
  try {
    // check if user is already exists with clerk userid property
    const clerkUser = await currentUser();
    let mongoUser = null;
    mongoUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser?.id,
      },
    });
    if (mongoUser) {
      return {
        data: mongoUser,
      };
    }

    // if user doesn't exists, create new user
    let username = clerkUser?.username;
    if (!username) {
      username = clerkUser?.firstName + " " + clerkUser?.lastName;
    }

    username = username.replace("null", "");
    const newUser: any = {
      clerkUserId: clerkUser?.id,
      username,
      email: clerkUser?.emailAddresses[0].emailAddress,
      profilePic: clerkUser?.imageUrl,
    };
    const result = await prisma.user.create({
      data: newUser,
    });
    return {
      data: result,
    };
  } catch (error: any) {
    console.log(error);
    return {
      error: error.message,
    };
  }
};

export const ToggleUserAdminStatus = async (userId: string, newRole: "admin" | "user") => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin: newRole === "admin" },
    });

    return { data: updatedUser, message: "User admin status updated successfully, Please refresh the page" };
  } catch (error: any) {
    console.error("Error updating user admin status:", error.stack);
    return { error: error.message };
  }
};

/**
 * Delete a user from the database.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<{ message?: string; error?: string }>}
 */
export const DeleteUser = async (userId: string) => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting user:", error.stack);
    return { error: error.message };
  }
};
