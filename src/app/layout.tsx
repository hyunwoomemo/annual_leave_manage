import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Lato } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// export const metadata: Metadata = {

// };

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fff",
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export async function generateMetadata({ params }) {
  return {
    manifest: "/manifest.webmanifest",
    applicationName: "Stepup",
    appleWebApp: {
      capable: true,
      title: "Stepup",
      statusBarStyle: "default",
    },
    title: "Next Shadcn",

    description: "Basic dashboard with Next.js and Shadcn",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  console.log("sessionsession", session);

  return (
    <html lang="en" className={`${lato.className}`} suppressHydrationWarning>
      <body className={"overflow-hidden"}>
        <NextTopLoader color="rgb(67,156,128)" showSpinner={false} />
        <NuqsAdapter>
          <Providers session={session}>
            {/* <Providers> */}
            <Toaster />
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
