import PageContainer from "@/components/layout/page-container";
import MyAnnualLeaveListing from "@/features/my/components/my-annual-leave-listing";
import MyAnnualLeaveViewPage from "@/features/my/components/my-annual-leave-view-page";
import { auth } from "@/lib/auth";
import { searchParamsCache } from "@/lib/searchparams";
import YearTabs from "./year-tabs";

const page = async (props) => {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  const session = await auth();
  const year = searchParams.year || new Date().getFullYear().toString();

  console.log("sessionsession", session);

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/info/${session?.user?.id}?year=${year}`);
  const json = await data.json();

  return (
    <PageContainer>
      <YearTabs currentYear={year} />
      <MyAnnualLeaveViewPage data={json} />
      {/* <Separator /> */}
      <MyAnnualLeaveListing employee_id={session?.user?.id} year={year} />
    </PageContainer>
  );
};

export default page;
