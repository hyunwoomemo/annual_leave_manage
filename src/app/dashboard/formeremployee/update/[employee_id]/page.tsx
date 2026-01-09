import PageContainer from "@/components/layout/page-container";
import React from "react";
import { revalidatePath } from "next/cache";
import EmployeeCreateForm from "@/features/employees/components/employee-create-form";
import { auth } from "@/lib/auth";
import { signOut } from "next-auth/react";

const page = async () => {
  const session = await auth();
  console.log(";sdfsdf", session);
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
      // console.log("values?.employee_num && session?.user?.id == values.id", values?.employee_num && session?.user?.id == values.id, values.employee_num, session?.user?.id, values.id);
      // if (values?.employee_num && session?.user?.id == values.id) {
      //   signOut();
      // }
      revalidatePath("/dashboard/employee");
    } else {
    }

    return result;
  };

  return (
    <PageContainer>
      <EmployeeCreateForm update={update} session={session} />
    </PageContainer>
  );
};

export default page;
