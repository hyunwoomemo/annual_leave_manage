import { Product } from "@/constants/data";
import { fakeProducts } from "@/constants/mock-api";
import { searchParamsCache } from "@/lib/searchparams";
import { DataTable as ProductTable } from "@/components/ui/table/data-table";
import { columns } from "./employee-tables/columns";

type EmployeeListingPage = {};

export default async function EmployeeListingPage({}: EmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");
  const departments = searchParamsCache.get("departments");

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/list?page=${page}&limit=${pageLimit}&search=${search}&department=${departments}`, { next: { tags: ["employeesList"] } });
  // const { success, data } = await res.json();
  // console.log("employees", data);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/list?page=${page}&limit=${pageLimit}&search=${search}&department=${departments}`, { next: { tags: ["employeesList"] } });
  const { success, data, totalCount } = await res.json();
  console.log("data", data, totalCount);

  // const data = await fakeProducts.getProducts(filters);
  const totalEmployees = totalCount;

  return <ProductTable columns={columns} data={data} totalItems={totalEmployees} />;
}
