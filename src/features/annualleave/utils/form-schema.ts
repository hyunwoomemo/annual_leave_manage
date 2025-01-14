import * as z from "zod";

export const annualLeaveSchema = z.object({
  department: z.string(),
  name: z.string(),
  type: z.string(),
  type2: z.string(),
  time: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  lastname: z.string().min(3, { message: "Product Name must be at least 3 characters" }),
  date: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: "Start date should be in the format YYYY-MM-DD",
  }),
});

export type AnnualLeaveFormValues = z.infer<typeof annualLeaveSchema>;
