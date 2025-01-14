import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  console.log("Dashboard session", session);
  if (!session?.user) {
    redirect("/");
  } else {
    redirect("/dashboard/calendar");
  }
}
