"use server";

import { revalidatePath } from "next/cache";

export const deleteEmployee = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Content-Type 추가
    },
    body: JSON.stringify({ status: -1, id }),
  });
  const json = await res.json();
  if (json.success) {
    revalidatePath("/dashboard/annualleave");
    revalidatePath("/dashboard/calendar");
  }
  return json;
};
