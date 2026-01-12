"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

interface YearTabsProps {
  currentYear: string;
}

export default function YearTabs({ currentYear }: YearTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6">
      <Tabs value={currentYear} onValueChange={handleYearChange}>
        <TabsList>
          <TabsTrigger value="2025">2025</TabsTrigger>
          <TabsTrigger value="2026">2026</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
