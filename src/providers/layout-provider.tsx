"use client";
import React, { useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button, Dropdown, message } from "antd";
import { GetCurrentUserFromMongoDB } from "@/actions/users";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

const userMenu = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Properties",
    path: "/user/properties",
  },
  {
    name: "Account",
    path: "/user/account",
  },
  {
    name: "Subscriptions",
    path: "/user/subscriptions",
  },
  {
    name: "Queries",
    path: "/user/queries",
  },
];
const adminMenu = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Properties",
    path: "/admin/properties",
  },
  {
    name: "Users",
    path: "/admin/users",
  },
];

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [menuToShow = userMenu, setMenuToShow] = React.useState<any>(userMenu);
  const [currentUserData = null, setCurrentUserData] =
    React.useState<User | null>(null);
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const pathname = usePathname();
  const isPublicRoute = ["sign-in", "sign-up"].includes(pathname.split("/")[1]);
  const isAdminRoute = pathname.split("/")[1] === "admin";
  const getHeader = () => {
    if (isPublicRoute) return null;
    return (
      <div>
        <div className="bg-black/90 backdrop-blur-md p-3 flex justify-between items-center rounded-b shadow-xl">
          <h1
            className="lg:mx-20 text-2xl text-white font-bold cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Taj Properties
          </h1>

          <div className="mx-5 sm:mx-10 lg:mx-20 bg-white py-1.5 px-3 sm:py-2 sm:px-4 lg:py-2 lg:px-5 rounded-xl flex items-center gap-3 sm:gap-4 lg:gap-5">

            <Dropdown
              menu={{
                items: menuToShow.map((item: any) => ({
                  label: item.name,
                  onClick: () => {
                    router.push(item.path);
                  },
                })),
              }}
            >
              <Button className="text-primary hover:text-primary" type="link">
                {currentUserData?.username}
              </Button>
            </Dropdown>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>
      </div>
    );
  };

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
