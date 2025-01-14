import PageContainer from "@/components/layout/page-container";
import React from "react";
import { revalidatePath } from "next/cache";
import EmployeeCreateForm from "@/features/employees/components/employee-create-form";

const page = async () => {
  const update = async (values) => {
    "use server";

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Content-Type 추가
      },
      body: JSON.stringify({ ...values }),
    });

    const result = await res.json();

    console.log("update resultresult", result);

    if (result.success) {
      revalidatePath("/dashboard/employee");
    }

    return result;
  };

  return (
    <PageContainer>
      <EmployeeCreateForm update={update} />
    </PageContainer>
  );
};

export default page;
