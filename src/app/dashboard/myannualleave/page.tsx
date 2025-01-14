import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyAnnualLeaveViewPage from "@/features/my/components/my-annual-leave-view-page";
import { auth } from "@/lib/auth";
import MyAnnualLeaveListing from "@/features/my/components/my-annual-leave-listing";
import { searchParamsCache } from "@/lib/searchparams";
const page = async (props) => {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  const session = await auth();

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employee/info/${session?.user?.id}`);
  const json = await data.json();

  console.log("json", json);

  return (
    <PageContainer>
      <MyAnnualLeaveViewPage data={json} />
      {/* <Separator /> */}
      <MyAnnualLeaveListing employee_id={session?.user?.id} />
    </PageContainer>
  );
};

export default page;
