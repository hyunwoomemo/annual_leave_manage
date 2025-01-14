"use client";

import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { CATEGORY_OPTIONS, useProductTableFilters } from "./use-annualleave-table-filters";

export default function ProductTableAction({ departments }) {
  const { departmentsFilter, setDepartmentsFilter, isAnyFilterActive, resetFilters, searchQuery, setPage, setSearchQuery } = useProductTableFilters();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch searchKey="name" searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPage={setPage} />
      <DataTableFilterBox filterKey="departments" title="Departments" options={departments} setFilterValue={setDepartmentsFilter} filterValue={departmentsFilter} />
      <DataTableResetFilter isFilterActive={isAnyFilterActive} onReset={resetFilters} />
    </div>
  );
}
