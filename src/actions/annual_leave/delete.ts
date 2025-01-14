"use server";

import { revalidatePath } from "next/cache";

export const deleteLeave = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annualLeave/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Content-Type 추가
    },
    body: JSON.stringify({ status: -1, id }),
  });
  const json = await res.json();
  console.log("sdfsdf", json);
  if (json.success) {
    revalidatePath("/dashboard/annualleave");
    revalidatePath("/dashboard/calendar");
  }
  return json;
};
