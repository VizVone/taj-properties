"use client";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Button, Dropdown, MenuProps, message } from "antd";
import { GetCurrentUserFromMongoDB } from "@/actions/users";
import { User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/loader";

type MenuItem = {
  name: string;
  path: string;
};

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
  const [menuToShow, setMenuToShow] = useState<MenuItem[]>(userMenu);
  const [currentUserData, setCurrentUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showScroll, setShowScroll] = useState<boolean>(false);
  const pathname = usePathname();
  const isPublicRoute = ["sign-in", "sign-up"].includes(pathname.split("/")[1]);
  const isAdminRoute = pathname.split("/")[1] === "admin";

  useEffect(() => {
    if (!isPublicRoute) getCurrentUser();

    // Detect Scroll Position
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Scroll to Top Function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getHeader = () => {
    if (isPublicRoute) return null;

    return (
      <div>
        <div className="bg-black/90 backdrop-blur-md p-3 flex justify-between items-center rounded-b shadow-xl">
          <h1
            className="lg:mx-20 text-2xl text-white font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            Taj Properties
          </h1>

          <div className="mx-5 sm:mx-10 lg:mx-20 bg-white py-1.5 px-3 sm:py-2 sm:px-4 lg:py-2 lg:px-5 rounded-xl flex items-center gap-3 sm:gap-4 lg:gap-5">
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

            <div className="lg:hidden">
              <Dropdown
                menu={{
                  items: menuToShow.map((item) => ({
                    key: item.path,
                    label: (
                      <button
                        onClick={() => router.push(item.path)}
                        className="text-center w-full px-4 py-2 rounded-2xl bg-white hover:bg-gray-200 active:bg-gray-300"
                      >
                        {item.name}
                      </button>
                    ),
                  })),
                }}
              >
                <Button className="text-black hover:text-primary" type="link">
                  Menu
                </Button>
              </Dropdown>
            </div>

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

  return (
    <div>
      {getHeader()}
      {getContent()}

      {/* ⬆ Floating Scroll to Top Button */}
      {showScroll && (
        <button onClick={scrollToTop} className="scroll-to-top">
          ⬆
        </button>
      )}
    </div>
  );
}

export default LayoutProvider;
