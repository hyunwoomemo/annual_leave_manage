import PageContainer from "@/components/layout/page-container";
import AnnualLeaveCreateForm from "@/features/annualleave/components/annualleave-create-form";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export default async function AnnualCreateViewPage() {
  const session = await auth();
  console.log("123123", session);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/info/${session?.user?.id}`);
  const json = await res.json();

  console.log("kjkjj", json);

  const create = async (data, employee) => {
    "use server";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annualLeave/create`, {
      body: JSON.stringify(data),
      method: "POST",
    });

    const json = await res.json();

    console.log("jsonjson", json);

    if (json.success) {
      revalidatePath("/dashboard/overview");
      // redirect("/dashboard/calendar");

      // setTimeout(() => {
      //   router.refresh();
      // }, 300);
    }
    return json;
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <AnnualLeaveCreateForm employee={json} categories={[]} initialData={null} create={create} />
      </div>
    </PageContainer>
  );
}
