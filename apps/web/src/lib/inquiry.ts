import { z } from "zod";
export const inquirySchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name.").max(120),
    email: z.string().trim().email("Enter a valid email address.").max(254),
    company: z.string().trim().min(2, "Enter your company name.").max(160),
    message: z
      .string()
      .trim()
      .min(20, "Tell us a little more (at least 20 characters).")
      .max(5000),
    website: z.string().max(0).optional(),
  })
  .strict();
