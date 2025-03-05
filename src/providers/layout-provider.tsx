"use client";
import React, { useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button, Dropdown, MenuProps, message } from "antd";
import { GetCurrentUserFromMongoDB } from "@/actions/users";
import { User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/loader";

// ✅ Define the TypeScript Type for menu items
type MenuItem = {
  name: string;
  path: string;
};

// ✅ Define User and Admin Menus
const userMenu: MenuItem[] = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/user/properties" },
  { name: "Account", path: "/user/account" },
  { name: "Subscriptions", path: "/user/subscriptions" },
  { name: "Queries", path: "/user/queries" },
];

const adminMenu: MenuItem[] = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/admin/properties" },
  { name: "Users", path: "/admin/users" },
];

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [menuToShow, setMenuToShow] = React.useState<MenuItem[]>(userMenu);
  const [currentUserData, setCurrentUserData] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const pathname = usePathname();
  const isPublicRoute = ["sign-in", "sign-up"].includes(pathname.split("/")[1]);
  const isAdminRoute = pathname.split("/")[1] === "admin";

  // ✅ Function to Get Header UI
  const getHeader = () => {
    if (isPublicRoute) return null;

    return (
      <div>
        <div className="bg-black/90 backdrop-blur-md p-3 flex justify-between items-center rounded-b shadow-xl">
          {/* 🏠 Website Logo */}
          <h1
            className="lg:mx-20 text-2xl text-white font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Taj Properties
          </h1>

          {/* 📌 Menu Section */}
          <div className="mx-5 sm:mx-10 lg:mx-20 bg-white py-1.5 px-3 sm:py-2 sm:px-4 lg:py-2 lg:px-5 rounded-xl flex items-center gap-3 sm:gap-4 lg:gap-5">
            
            {/* ✅ Large Screen Menu (Inline Buttons) */}
            <div className="hidden lg:flex gap-4">
              {menuToShow.map((item: MenuItem) => (
                <Button
                  key={item.path}
                  type="link"
                  className="text-primary hover:text-blue-600"
                  onClick={() => router.push(item.path)}
                >
                  {item.name}
                </Button>
              ))}
            </div>

            {/* ✅ Small Screen Menu (Dropdown) */}
            <div className="lg:hidden">
              <Dropdown
                menu={{
                  items: menuToShow.map((item) => ({
                    key: item.path,
                    label: (
                      <button
                        onClick={() => router.push(item.path)}
                        className="text-left w-full px-4 py-2 rounded-2xl bg-white hover:bg-gray-200 active:bg-gray-300"
                      >
                        {item.name}
                      </button>
                    ),
                  })),
                }}
              >
                <Button className="text-primary hover:text-primary" type="link">
                  Menu
                </Button>
              </Dropdown>
            </div>

            {/* 👤 User Profile Button */}
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </div>
    );
  };

  // ✅ Function to Get Page Content
  const getContent = () => {
    if (isPublicRoute) return children;
    if (loading) return <Loader />;
    if (isAdminRoute && !currentUserData?.isAdmin)
      return (
        <div className="py-20 lg:px-20 px-5 text-center text-gray-600 text-sm">
          You are not authorized to view this page
        </div>
      );
    return <div className="py-5 lg:px-20 px-5">{children}</div>;
  };

  // ✅ Function to Get the Current User Data
  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response: any = await GetCurrentUserFromMongoDB();
      if (response.error) throw new Error(response.error.message);
      setCurrentUserData(response.data);
      if (response.data.isAdmin) {
        setMenuToShow(adminMenu);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isPublicRoute) getCurrentUser();
  }, []);

  return (
    <div>
      {getHeader()}
      {getContent()}
    </div>
  );
}

export default LayoutProvider;
