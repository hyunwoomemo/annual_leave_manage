import PageContainer from "@/components/layout/page-container";
import AnnualLeaveCreateForm from "./annualleave-create-form";

export default function ProfileViewPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <AnnualLeaveCreateForm categories={[]} initialData={null} />
      </div>
    </PageContainer>
  );
}
