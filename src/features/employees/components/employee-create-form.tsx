"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { selectedEmployee } from "@/store/employee/atom";
import { parseDate } from "@internationalized/date";
import { DatePicker } from "@nextui-org/date-picker";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import moment from "moment";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const EmployeeCreateForm = ({ create, update, session }: any) => {
  const [values, setValues] = useState<any>({});
  const [updateValues, setupdateValues] = useState<any>({});
  const route = useRouter();
  const employee = useAtomValue(selectedEmployee) as any;

  useEffect(() => {
    if (update && employee) {
      setValues({ ...employee });
    } else {
      if (update && !employee) {
        route.push("/dashboard/employee");
      }
    }
  }, [employee]);

  const handleInputChange = (type: string, text: string) => {
    if (type === "personalId") {
      // 숫자만 허용하고 하이픈 제외
      text = text.replace(/[^0-9]/g, "");

      // 입력 길이 제한 (13자리)
      if (text.length > 14) {
        text = text.slice(0, 13);
      }

      // 6자리 입력 시 자동으로 하이픈 추가
      if (text.length > 6) {
        text = text.slice(0, 6) + "-" + text.slice(6);
      }
    }

    if (update) {
      setValues((prev: any) => ({ ...prev, [type]: text }));

      setupdateValues((prev: any) => ({ ...prev, [type]: text }));
    } else {
      setValues((prev: any) => ({ ...prev, [type]: text }));
    }
  };

  const handleDateChange = (type: string, value: any) => {
    const dateString = moment(new Date(value.year, value.month - 1, value.day)).format("YYYY-MM-DD");
    setValues((prev: any) => ({ ...prev, [type]: dateString }));
    if (update) {
      setupdateValues((prev: any) => ({ ...prev, [type]: dateString }));
    }
  };

  const handleCreate = async () => {
    if (!values.employee_num || !values.name || !values.birthDate || !values.startDate || !values.department || !values.hp) {
      return toast.error("필수 입력값이 누락되었습니다.");
    }

    const res = await create(values);

    console.log("create", res);

    if (res.success) {
      toast.success("직원이 등록되었습니다.");
      route.push("/dashboard/employee");
    } else {
      toast.error(res.message || "오류가 발생하였습니다.");
    }
  };

  const handleUpdate = async () => {
    const res = await update({ ...updateValues, id: employee.id });

    console.log("update", res);

    if (res.success) {
      if (updateValues.employee_num && employee.id == session?.user?.id) {
        toast.success("현재 로그인되어있는 유저의 사번이 변경되어 재로그인이 필요합니다.");
        return signOut({
          redirect: true,
          redirectTo: "/",
        });
      }
      toast.success("직원이 수정되었습니다.");
      route.push("/dashboard/employee");
    } else {
      toast.error(res.message || "직원 수정에 실패했습니다.");
      // route.push("/dashboard/employee");
    }
  };

  console.log("vvv", values, updateValues);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Heading title="Employee" description="" />
        <Button onClick={update ? handleUpdate : handleCreate} className={cn(buttonVariants(), "text-xs md:text-sm")}>
          <Plus className="mr-2 h-4 w-4" /> {update ? "수정" : "직원 등록"}
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>사번</Label>
              <Input defaultValue={values?.employee_num || values?.id} onChange={(e) => handleInputChange("employee_num", e.target.value)} placeholder="사번을 입력해주세요." />
            </div>
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>이름</Label>
              <Input defaultValue={values?.name} disabled={update ? true : false} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="이름을 입력해주세요." />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>부서</Label>
              <Input defaultValue={values?.department} onChange={(e) => handleInputChange("department", e.target.value)} placeholder="부서명을 입력해주세요." />
            </div>
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>핸드폰</Label>
              <Input defaultValue={values?.hp} onChange={(e) => handleInputChange("hp", e.target.value)} placeholder="핸드폰번호를 입력해주세요." />
            </div>
            {/* <div className="flex flex-col flex-1 gap-4 py-4 my-4">
            </div> */}
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>주민번호</Label>
              <Input
                maxLength={14}
                value={values?.personalId}
                defaultValue={values?.personalId}
                onChange={(e) => handleInputChange("personalId", e.target.value)}
                placeholder="주민번호를 입력해주세요."
                onBlur={(e) => values.personalId?.length < 14 && toast.error("주민번호를 정확히 입력해주세요.")}
              />
            </div>
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>생년월일</Label>
              {/* <Input placeholder="생년월일을 입력해주세요." /> */}
              <DatePicker
                value={(update && updateValues?.birthDate) || values?.birthDate ? (parseDate(moment((update && updateValues?.birthDate) || values.birthDate).format("YYYY-MM-DD")) as any) : null}
                onChange={(e) => handleDateChange("birthDate", e)}
                showMonthAndYearPickers
                label="Birth Date"
                variant="bordered"
              />
            </div>
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>입사일</Label>
              {/* <Input placeholder="입사일을 입력해주세요." /> */}
              <DatePicker
                value={(update && updateValues?.startDate) || values?.startDate ? (parseDate(moment((update && updateValues?.startDate) || values.startDate).format("YYYY-MM-DD")) as any) : null}
                onChange={(e) => handleDateChange("startDate", e)}
                showMonthAndYearPickers
                label="Start Date"
                variant="bordered"
              />
            </div>
            <div className="flex flex-col flex-1 gap-4 py-4 my-4">
              <Label>퇴사일</Label>
              {/* <Input placeholder="입사일을 입력해주세요." /> */}
              <DatePicker
                value={(update && updateValues?.endDate) || values?.endDate ? (parseDate(moment((update && updateValues?.endDate) || values.endDate).format("YYYY-MM-DD")) as any) : null}
                onChange={(e) => handleDateChange("endDate", e)}
                showMonthAndYearPickers
                label="End Date"
                variant="bordered"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeCreateForm;
