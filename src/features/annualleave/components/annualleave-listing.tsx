import { DataTable as AnnualLeaveTable } from "@/components/ui/table/data-table";
import { searchParamsCache } from "@/lib/searchparams";
import { columns } from "./annualleave-tables/columns";

type AnnualLeaveListingPage = {};

export default async function AnnualLeaveListingPage({}: AnnualLeaveListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");
  const departments = searchParamsCache.get("departments");
  const year = searchParamsCache.get("year");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annualLeave/list?page=${page}&limit=${pageLimit}&search=${search}&department=${departments}&apply=true&year=${year}`);
  const { totalCount, data } = await res.json();

  console.log("data", data);

  // const data = await fakeProducts.getProducts(filters);
  const totalAnnualLeaveItems = totalCount;
  // const products: Product[] = data.products;

  return <AnnualLeaveTable columns={columns} data={data} totalItems={totalAnnualLeaveItems} />;
}
