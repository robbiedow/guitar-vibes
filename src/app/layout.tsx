import type { Metadata, Viewport } from "next";
import { RegisterSW } from "@/components/register-sw";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rob's Tools",
  description: "A collection of useful tools",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rob's Tools",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0c0c0c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <RegisterSW />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
