import { Product } from "@/constants/data";
import { fakeProducts } from "@/constants/mock-api";
import { searchParamsCache } from "@/lib/searchparams";
import { DataTable as ProductTable } from "@/components/ui/table/data-table";
import { columns } from "./my-annual-leave-tables/columns";

type EmployeeListingPage = {};

export default async function MyAnnualLeaveListing({ employee_id }: EmployeeListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("q");
  const pageLimit = searchParamsCache.get("limit");
  const departments = searchParamsCache.get("departments");

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/list?page=${page}&limit=${pageLimit}&search=${search}&department=${departments}`, { next: { tags: ["employeesList"] } });
  // const { success, data } = await res.json();
  // console.log("employees", data);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annualLeave/list?page=${page}&limit=${pageLimit}&search=${search}&department=${departments}&employee_id=${employee_id}`, {
    next: { tags: ["annualLeaveList"] },
  });
  const { totalCount, data } = await res.json();

  // const data = await fakeProducts.getProducts(filters);
  const totalEmployees = totalCount;

  return (
    <div className="pt-10 w-2/3">
      <ProductTable columns={columns} data={data} totalItems={totalEmployees} />
    </div>
  );
}
