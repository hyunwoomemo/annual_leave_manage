"use client";

import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useProductTableFilters } from "./use-employee-table-filters";

export default function ProductTableAction({ departments, employmentStatuses }: any) {
  const { departmentsFilter, setDepartmentsFilter, isAnyFilterActive, resetFilters, searchQuery, setPage, setSearchQuery, isEmployedFilter, setIsEmployedFilter } = useProductTableFilters();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch searchKey="name" searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPage={setPage} />
      <DataTableFilterBox filterKey="departments" title="부서" options={departments} setFilterValue={setDepartmentsFilter} filterValue={departmentsFilter} />
      <DataTableFilterBox filterKey="isEmployed" title="재직 여부" options={employmentStatuses} setFilterValue={setIsEmployedFilter} filterValue={isEmployedFilter} />
      <DataTableResetFilter isFilterActive={isAnyFilterActive} onReset={resetFilters} />
    </div>
  );
}
