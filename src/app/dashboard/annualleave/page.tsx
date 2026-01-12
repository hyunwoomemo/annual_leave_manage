import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import AnnualLeaveListingPage from "@/features/annualleave/components/annualleave-listing";
import AnnualLeaveTableAction from "@/features/annualleave/components/annualleave-tables/annualleave-table-action";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import YearTabs from "./year-tabs";

export const metadata = {
  title: "연차 관리: Annualleave",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  const year = searchParams.year || new Date().getFullYear().toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/site/departments`);
  const json = await res.json();

  const departments = json?.data?.map((v) => {
    return { value: v.department, label: v.department };
  });

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="연차 신청 목록" description="" />
        </div>
        <Separator />
        <YearTabs currentYear={year} />
        <AnnualLeaveTableAction departments={departments} />
        <Suspense key={key} fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}>
          <AnnualLeaveListingPage year={year} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
