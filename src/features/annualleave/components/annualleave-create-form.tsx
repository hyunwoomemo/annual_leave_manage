"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangleIcon, Plus, Trash, Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { AnnualLeaveFormValues, annualLeaveSchema } from "../utils/form-schema";
import { DatePicker, DateRangePicker } from "@nextui-org/date-picker";
import { parseZonedDateTime } from "@internationalized/date";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import moment from "moment-timezone";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroupIndicator } from "@radix-ui/react-radio-group";
import { TimeInput } from "@nextui-org/date-input";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
interface AnnualLeaveFormType {
  initialData: any | null;
  categories: any;
}
const AnnualLeaveCreateForm: React.FC<AnnualLeaveFormType> = ({ initialData, categories, employee, create }) => {
  console.log("create", create);

  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = initialData ? "Edit product" : "연차 신청";
  // const description = initialData ? "Edit a product." : "To create your resume, we first need some basic information about you.";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({});

  // console.log("ddd", data);
  // const delta = currentStep - previousStep;

  const defaultValues = {};

  const types = [
    {
      id: "1",
      name: "연차",
    },
    {
      id: "2",
      name: "반차",
    },
    {
      id: "3",
      name: "반반차",
    },
    {
      id: "4",
      name: "공가",
    },
    {
      id: "5",
      name: "경조 휴가",
    },
  ];

  const types2 = [
    {
      id: "1",
      name: "오전",
    },
    {
      id: "2",
      name: "오후",
    },
  ];

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

  const onSubmit = async (data: AnnualLeaveFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
        // const res = await axios.post(`/api/products/create-product`, data);
        // console.log("product", res);
      }

      console.log("dddsmfksdmkf", data);
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL/api/annualLeave/create", {
      //   body: JSON.stringify(data),
      //   method: "POST",
      // });

      // const json = await res.json();

      // console.log("json", json);

      // router.refresh();
      // router.push(`/dashboard/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

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

    const formData = new FormData();
    for (const key in values) {
      if (!values[key]) continue;

      formData.append(key, values[key]);
    }

    formData.append("employee_id", employee.id);
    formData.append("name", employee.name);

    console.log("formDataformDataformData", formData);

    const dataObject = {};
    formData.forEach((value, key) => {
      dataObject[key] = value;
    });

    const result = await create(dataObject, employee);
    console.log("resultresult", result);

    if (result.success) {
      toast.success("연차 신청이 완료되었습니다.");
      router.push("/dashboard/myannualleave");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} />
        <Button onClick={handleCreate} className={cn(buttonVariants(), "text-xs md:text-sm")} type="submit">
          <Plus className="mr-2 h-4 w-4" /> 완료
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
                  // control={form.control}
                  name="annual_leave_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연차 남은 갯수</FormLabel>
                      <FormControl>
                        <Input disabled={true} placeholder="johndoe@gmail.com" {...field} value={employee.annual_leave_count} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => {
                    console.log("field", field);
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

                <div className={cn(currentStep === 1 ? "w-full md:inline-block" : "gap-8 md:grid md:grid-cols-3 justify-center")}>
                  {Number(form.watch("type")) > 0 && (
                    <FormField
                      control={form.control}
                      name={`start_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>연차 사용 날짜</FormLabel>
                          <FormControl>
                            {form.watch("type") === "1" || Number(form.watch("type")) > 3 ? ( // 연차일 경우, DateRangePicker
                              <DateRangePicker
                                hideTimeZone
                                onChange={(e) => {
                                  console.log("Date range selected:", e);

                                  // Update the form state for start_date and end_date
                                  form.setValue("start_date", formatDate(new Date(e?.start.year, e?.start.month - 1, e?.start.day))); // Save the start date
                                  // form.setValue("end_date", e.end); // Save the end date
                                  form.setValue("end_date", formatDate(new Date(e?.end.year, e?.end.month - 1, e?.end.day))); // Save the start date
                                }}
                                label="Event duration"
                              />
                            ) : form.watch("type") === "2" ? ( // 반차일 경우, 단일 날짜 선택
                              // <Input type="date" disabled={loading} {...field} placeholder="날짜를 선택하세요" />
                              <DatePicker
                                hideTimeZone
                                // minValue={}
                                onChange={(e) => {
                                  console.log("Date selected:", e);
                                  field.onChange(formatDate(new Date(e?.year, e?.month - 1, e?.day)));
                                }}
                                // defaultValue={{
                                //   start: parseZonedDateTime(`${moment().format("YYYY-MM-DD")}T${moment().format("HH:00")}[Asia/Seoul]`),
                                //   end: parseZonedDateTime(`${moment().format("YYYY-MM-DD")}T${moment().format("HH:00")}[Asia/Seoul]`),
                                // }}
                                label="Event duration"
                                // visibleMonths={2}
                              />
                            ) : form.watch("type") === "3" ? ( // 반반차일 경우, 시간 포함 날짜 선택
                              <div className="flex items-center gap-2">
                                <DatePicker
                                  hideTimeZone
                                  // minValue={}
                                  onChange={(e) => {
                                    console.log("Date selected:", e);
                                    field.onChange(formatDate(new Date(e?.year, e?.month - 1, e?.day)));
                                  }}
                                  // defaultValue={{
                                  //   start: parseZonedDateTime(`${moment().format("YYYY-MM-DD")}T${moment().format("HH:00")}[Asia/Seoul]`),
                                  //   end: parseZonedDateTime(`${moment().format("YYYY-MM-DD")}T${moment().format("HH:00")}[Asia/Seoul]`),
                                  // }}
                                  label="Event duration"
                                  // visibleMonths={2}
                                />
                                {/* <Input type="date" disabled={loading} {...field} placeholder="날짜를 선택하세요" /> */}
                                {/* <Input type="time" disabled={loading} {...field} onChange={(e) => console.log("eee", e)} placeholder="시간을 선택하세요" /> */}
                                {/* <Input type="time" disabled={loading} {...field} placeholder="시간을 선택하세요" /> */}
                              </div>
                            ) : (
                              <p>사용할 날짜를 선택해주세요.</p>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {form.watch("type") == 3 && (
                    <FormField
                      control={form.control}
                      name={`time`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>시간</FormLabel>
                          <FormControl>
                            <TimeInput
                              label="Event Time"
                              onChange={(e) => {
                                console.log("Date selected:", e);
                                form.setValue("start_date", moment(form.watch("start_date")).format(`YYYY-MM-DD ${e?.hour}:${e?.minute}`));
                                form.setValue("end_date", moment(form.watch("start_date")).format(`YYYY-MM-DD ${Number(e?.hour) + 4}:${e?.minute}`));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {form.watch("type") === "2" && (
                    <FormField
                      control={form.control}
                      name="type2"
                      render={({ field }) => {
                        console.log("field", field);
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
                                {types2.map((type) => (
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
                  )}
                  <FormField
                    // control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>연차 사유</FormLabel>
                        <FormControl>
                          <Textarea disabled={loading} placeholder="사유를 입력해주세요." {...field} value={field.value} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </form>
      </Form>
      {/* Navigation */}
    </>
  );
};

export default AnnualLeaveCreateForm;
