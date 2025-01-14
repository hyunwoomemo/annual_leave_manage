import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import ProductListingPage from "@/features/employees/components/employee-listing";
import ProductTableAction from "@/features/employees/components/employee-tables/employee-table-action";

export const metadata = {
  title: "Dashboard: Employee",
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  const key = serialize({ ...searchParams });

  const res = await fetch(`http://localhost:3000/api/site/departments`);
  const json = await res.json();

  const departments = json.data.map((v) => {
    return { value: v.department, label: v.department };
  });

  console.log("departments", departments);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="직원" description="Manage employee (Server side table functionalities.)" />
          <Link href="/dashboard/employee/create" className={cn(buttonVariants(), "text-xs md:text-sm")}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <ProductTableAction departments={departments} />
        <Suspense key={key} fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}>
          <ProductListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
