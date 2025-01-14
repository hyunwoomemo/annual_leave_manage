import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import Calendar from "@/features/overview/components/calendar";
import CalendarPage from "@/features/overview/components/calendar-page";
import OverViewPage from "@/features/overview/components/overview";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { headers } from "next/headers";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard : Overview",
};

export default async function page(props) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return <CalendarPage />;
}
