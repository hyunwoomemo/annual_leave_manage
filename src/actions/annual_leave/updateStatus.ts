"use server";

import { revalidatePath } from "next/cache";

export const updateStatus = async (row, status) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annualLeave/updateStatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Content-Type 추가
    },
    body: JSON.stringify({ id: row.original.id, status }),
  });

  const json = await res.json();
  console.log("sdfsdf", json);

  if (json.success) {
    revalidatePath("/dashboard/annualleave");
  }

  return json;
};
