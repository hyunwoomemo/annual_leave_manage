import { Metadata } from "next";
import SignInViewPage from "@/features/auth/components/sigin-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "연차 관리 | Sign In",
  description: "연차 관리",
};

export default async function Page() {
  const session = await auth();
  console.log("session123", session);

  if (session?.user.name) {
    redirect("/dashboard/calendar");
  } else {
    return <SignInViewPage />;
  }
}
