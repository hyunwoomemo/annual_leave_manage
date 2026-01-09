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
  const [searchQuery, setSearchQuery] = useQueryState("q", searchParams.q.withOptions({ shallow: false, throttleMs: 500 }).withDefault(""));

  const [departmentsFilter, setDepartmentsFilter] = useQueryState("departments", searchParams.departments.withOptions({ shallow: false }).withDefault("전체"));

  const [isEmployedFilter, setIsEmployedFilter] = useQueryState("isEmployed", searchParams.isEmployed.withOptions({ shallow: false }).withDefault("전체"));

  const [page, setPage] = useQueryState("page", searchParams.page.withDefault(1));

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setDepartmentsFilter("all");
    setIsEmployedFilter("all");

    setPage(1);
  }, [setSearchQuery, setDepartmentsFilter, setIsEmployedFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!departmentsFilter || !!isEmployedFilter;
  }, [searchQuery, departmentsFilter, isEmployedFilter]);
  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    departmentsFilter,
    setDepartmentsFilter,
    isEmployedFilter,
    setIsEmployedFilter,
  };
}
