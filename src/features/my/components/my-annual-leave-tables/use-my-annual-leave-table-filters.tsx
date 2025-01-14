"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export const CATEGORY_OPTIONS = [
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Clothing", label: "Clothing" },
  { value: "Toys", label: "Toys" },
  { value: "Groceries", label: "Groceries" },
  { value: "Books", label: "Books" },
  { value: "Jewelry", label: "Jewelry" },
  { value: "Beauty Products", label: "Beauty Products" },
];
export function useProductTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState("q", searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault(""));

  const [departmentsFilter, setDepartmentsFilter] = useQueryState("departments", searchParams.departments.withOptions({ shallow: false }).withDefault(""));

  const [page, setPage] = useQueryState("page", searchParams.page.withDefault(1));

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setDepartmentsFilter(null);

    setPage(1);
  }, [setSearchQuery, setDepartmentsFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!departmentsFilter;
  }, [searchQuery, departmentsFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    departmentsFilter,
    setDepartmentsFilter,
  };
}
