"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCsrfToken, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  employee_num: z.any(),
  // email: z.string().email({ message: "Enter a valid email address" }),
  password: z.any(),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, startTransition] = useTransition();
  const [csrfToken, setCsrfToken] = useState("");
  const defaultValues = {};
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);

  const onSubmit = async (data: UserFormValue) => {
    try {
      console.log("data", data);
      const res = await signIn("credentials", {
        employee_num: data.employee_num,
        password: data.password,
        redirect: false, // redirect를 수동으로 처리
      });

      console.log("sssignin res", res);

      if (res.code === "wrong_password") {
        toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
      } else {
        if (res.code === "no_user") {
          toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
        } else {
          toast.success("로그인 성공!");
          window.location.href = callbackUrl ?? "/dashboard";
        }
      }
      // if (res?.ok) {
      //   // 로그인 성공 시
      //   toast.success("로그인 성공!");
      //   window.location.href = callbackUrl ?? "/dashboard";
      // } else {
      //   // 로그인 실패 시
      //   toast.error(res?.error || "로그인에 실패했습니다. 다시 시도해주세요.");
      // }
    } catch (err) {
      console.error(err);
      toast.error("로그인 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="employee_num"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사번</FormLabel>
                <FormControl>
                  <Input placeholder="사번을 입력해주세요." disabled={loading} {...field} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="비밀번호를 입력해주세요." disabled={loading} {...field} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            로그인
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        {/* <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div> */}
      </div>
      {/* <GithubSignInButton /> */}
    </>
  );
}
