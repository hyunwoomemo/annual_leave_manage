"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export const revalidate = async (tag) => {
  if (String(tag).startsWith("/")) {
    return revalidatePath(tag);
  } else {
    return revalidateTag(tag);
  }
};
