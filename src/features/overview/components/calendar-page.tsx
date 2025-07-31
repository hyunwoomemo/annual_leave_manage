import { searchParamsCache } from "@/lib/searchparams";
import React from "react";
import Calendar from "./calendar";

export default async function CalendarPage() {
  const year = searchParamsCache.get("year");
  const month = searchParamsCache.get("month");

  console.log("yyy", year, month, process.env.NEXT_PUBLIC_API_URL);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annualLeave/listByMonth?year=${year}&month=${month}`);
  const { totalCount, data } = await res.json();

  console.log("datadata", data);

  return <Calendar totalCount={totalCount} data={data}></Calendar>;
}
