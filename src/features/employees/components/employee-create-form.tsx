"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import moment from "moment";
const EmployeeCreateForm = ({ create }) => {
  const [values, setValues] = useState({});
  const route = useRouter();

  const handleInputChange = (type, text) => {
    setValues((prev) => ({ ...prev, [type]: text }));
  };

  const handleDateChange = (type, value) => {
    setValues((prev) => ({ ...prev, [type]: moment(new Date(value.year, value.month - 1, value.day)).format("YYYY-MM-DD") }));
  };

  const handleCreate = async () => {
    if (!values.name || !values.department || !values.birthDate || !values.startDate) {
      toast.error("필수 입력값이 입력되지 않았습니다.");
    }

    const res = await create(values);

    console.log("create", res);

    if (res.success) {
      toast.success("직원이 등록되었습니다.");
      route.push("/dashboard/employee");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Heading title="Employee" description="Manage employee (Server side table functionalities.)" />
        <Button onClick={handleCreate} className={cn(buttonVariants(), "text-xs md:text-sm")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>이름</Label>
              <Input onChange={(e) => handleInputChange("name", e.target.value)} placeholder="이름을 입력해주세요." />
            </div>
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>부서</Label>
              <Input onChange={(e) => handleInputChange("department", e.target.value)} placeholder="부서명을 입력해주세요." />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>핸드폰</Label>
              <Input onChange={(e) => handleInputChange("hp", e.target.value)} placeholder="핸드폰번호를 입력해주세요." />
            </div>
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              {/* <Label>핸드폰</Label>
            <Input onChange={(e) => handleInputChange("hp", e.target.value)} placeholder="이름을 입력해주세요." /> */}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>생년월일</Label>
              {/* <Input placeholder="생년월일을 입력해주세요." /> */}
              <DatePicker onChange={(e) => handleDateChange("birthDate", e)} onClick={(e) => console.log("eee", e)} showMonthAndYearPickers label="Birth Date" variant="bordered" />
            </div>
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>입사일</Label>
              {/* <Input placeholder="입사일을 입력해주세요." /> */}
              <DatePicker onChange={(e) => handleDateChange("startDate", e)} showMonthAndYearPickers label="Start Date" variant="bordered" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCreateForm;
