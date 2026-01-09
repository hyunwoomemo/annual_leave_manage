"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import moment from "moment-timezone";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AnnualLeaveFormValues, annualLeaveSchema } from "../utils/form-schema";
interface AnnualLeaveFormType {
  initialData: any | null;
  categories: any;
}
const AnnualLeaveManageForm: React.FC<AnnualLeaveFormType> = ({ employee, create }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});

  // console.log("ddd", data);
  // const delta = currentStep - previousStep;

  const defaultValues = {};

  const types = [
    {
      id: "11",
      name: "관리자 지급",
    },
    {
      id: "12",
      name: "관리자 차감",
    },
  ];

  // const types2 = [
  //   {
  //     id: "1",
  //     name: "오전",
  //   },
  //   {
  //     id: "2",
  //     name: "오후",
  //   },
  // ];

  const form = useForm<AnnualLeaveFormValues>({
    resolver: zodResolver(annualLeaveSchema),
    mode: "onChange",
  });

  const {
    control,
    formState: { errors },
  } = form;

  const { append, remove, fields } = useFieldArray({
    control,
    name: "jobs",
  });

  console.log("fieldfield", fields);

  const processForm: SubmitHandler<AnnualLeaveFormValues> = (data) => {
    console.log("data ==>", data);
    setData(data);
    // api call and reset
    // form.reset();
  };

  type FieldName = keyof AnnualLeaveFormValues;

  const countries = [{ id: "wow", name: "india" }];
  const cities = [{ id: "2", name: "kerala" }];

  const formatDate = (date) => {
    return `${moment(new Date(date)).format("YYYY-MM-DD")}`;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const values = form.getValues();

    console.log("vvv", values);

    const formData = new FormData();
    for (const key in values) {
      if (!values[key]) continue;

      formData.append(key, values[key]);
    }

    formData.append("employee_id", employee.id);

    console.log("formDataformDataformData", formData);

    const dataObject = {};
    formData.forEach((value, key) => {
      dataObject[key] = value;
    });

    const result = await create(dataObject, employee);
    console.log("resultresult", result);

    if (result.success) {
      toast.success("요청 성공하였습니다.");
      router.back();
    } else {
      toast.success("요청 실패하였습니다.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={"연차 관리"} />
        <Button onClick={handleCreate} className={cn(buttonVariants(), "text-xs md:text-sm")} type="submit">
          <Save className="mr-2 h-4 w-4" /> 완료
        </Button>
      </div>
      {/* <Separator /> */}

      <Separator />
      <Form {...form}>
        <form className="w-full space-y-8">
          <div className={cn(currentStep === 1 ? "w-full md:inline-block" : "gap-8 md:grid md:grid-cols-1")}>
            {currentStep === 0 && (
              <>
                <FormField
                  // control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>부서명</FormLabel>
                      <FormControl>
                        <Input disabled={true} placeholder="John" {...field} value={employee.department} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input disabled={true} placeholder="Doe" {...field} value={employee.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>종류</FormLabel>
                        <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue defaultValue={field.value} placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* @ts-ignore  */}
                            {types.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                {form.watch("type") && (
                  <>
                    <FormField
                      name="given_number"
                      render={({ field }) => {
                        const isGive = form.watch("type") == 11;
                        const label = isGive ? "지급" : "차감";

                        const handleAdd = (amount: number) => {
                          const current = parseFloat(field.value) || 0;
                          field.onChange((current + amount).toFixed(3));
                        };

                        const handleReset = () => {
                          field.onChange("0");
                        };

                        return (
                          <FormItem>
                            <FormLabel>{label} 갯수</FormLabel>
                            <FormControl>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                  <Button type="button" onClick={() => handleAdd(0.125)}>
                                    +1시간
                                  </Button>
                                  <Button type="button" onClick={() => handleAdd(1)}>
                                    +1일
                                  </Button>
                                  <Button type="button" variant="destructive" onClick={handleReset}>
                                    리셋
                                  </Button>
                                </div>
                                <div style={{ marginTop: "6px" }}>
                                  총 <strong>{field.value || 0}</strong>일
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      // control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{form.watch("type") == 11 ? "지급" : "차감"} 사유</FormLabel>
                          <FormControl>
                            <Textarea disabled={loading} placeholder="사유를 입력해주세요." {...field} value={field.value} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </form>
      </Form>
      {/* Navigation */}
    </>
  );
};

export default AnnualLeaveManageForm;
