import type { Metadata, Viewport } from "next";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import ThemeProvider from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "@/providers/layout-provider";
import GoogleTranslate from "@/components/GoogleTranslate"; // Import Google Translate component

export const metadata: Metadata = {
  title: "Taj Properties",
  description: "One-stop for all your property needs",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body>
          <ThemeProvider>
            <LayoutProvider>
              <GoogleTranslate />
              {children}
            </LayoutProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
