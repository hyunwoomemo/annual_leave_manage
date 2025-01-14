import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import Calendar from "@/features/overview/components/calendar";
import CalendarPage from "@/features/overview/components/calendar-page";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { headers } from "next/headers";
import { Suspense } from "react";

export const metadata = {
  title: "Dashboard : Overview",
};

export default async function page(props) {
  // const year = searchParamsCache.get("year");
  // const month = searchParamsCache.get("month");
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });

  return (
    // <ErrorBoundary errorComponent={() => <span>에러 발생</span>}>
    <Suspense key={key} fallback={<span>로딩중...</span>}>
      <CalendarPage />
    </Suspense>
    // </ErrorBoundary>
  );
}
