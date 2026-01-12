import PageContainer from "@/components/layout/page-container";
import MyAnnualLeaveListing from "@/features/my/components/my-annual-leave-listing";
import MyAnnualLeaveViewPage from "@/features/my/components/my-annual-leave-view-page";
import { searchParamsCache } from "@/lib/searchparams";
import YearTabs from "./year-tabs";

const page = async (props) => {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  const year = searchParams.year || new Date().getFullYear().toString();

  const params = await props.params;
  const employeeId = params.employeeId;
  console.log("employeeId", employeeId);
  console.log("propsprops", year);

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/info/${employeeId}?year=${year}`);
  const json = await data.json();

  console.log("jsonjsonjson", json);

  return (
    <PageContainer>
      <YearTabs currentYear={year} />
      <MyAnnualLeaveViewPage data={json} />
      {/* <Separator /> */}
      <MyAnnualLeaveListing employee_id={employeeId} year={year} />
    </PageContainer>
  );
};

export default page;
