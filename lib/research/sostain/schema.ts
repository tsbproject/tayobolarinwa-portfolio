import { z } from "zod";
import { businessCategories, challenges, channels, surveyVersion } from "./questions";

const choice = (values: readonly string[]) => z.string().refine((v) => values.includes(v), "Select a valid option.");

export const researchSurveySchema = z.object({
  surveyVersion: z.literal(surveyVersion),
  submissionId: z.uuid(),
  role: choice(["Business owner / Founder","Business manager","Sales / Customer service","Finance / Accounts","Operations / Administration","Other"]),
  category: z.enum(businessCategories),
  teamSize: choice(["1","2–5","6–10","11–20","21–50","More than 50"]),
  businessAge: choice(["Less than 6 months","6–12 months","1–3 years","4–7 years","More than 7 years"]),
  location: z.string().trim().min(2).max(100),
  enquiries: choice(["0–10","11–30","31–100","101–300","More than 300","Not sure"]),
  channels: z.array(z.enum(channels)).min(1).max(7),
  tracking: choice(["WhatsApp chat history","Notebook / Paper","Excel / Google Sheets","Dedicated CRM or business software","Staff memory / Verbal communication","Other"]),
  missedFollowups: choice(["Never","Once","2–5 times","6–10 times","More than 10 times","Not sure"]),
  recordkeeping: choice(["Notebook / Paper","Excel / Google Sheets","Accounting software","POS / Banking app","No consistent method","Other"]),
  profitConfidence: z.coerce.number().int().min(1).max(5),
  invoices: choice(["Yes, frequently","Yes, occasionally","No"]),
  latePayments: choice(["Never","Rarely","Sometimes","Frequently","Not applicable"]),
  debtTracking: choice(["Notebook / Paper","Spreadsheet","Accounting / Invoicing software","WhatsApp conversations","No consistent tracking","Not applicable","Other"]),
  challenges: z.array(z.enum(challenges)).min(1).max(3),
  adminHours: choice(["Less than 2","2–5","6–10","11–20","More than 20","Not sure"]),
  paidTools: z.string().trim().max(500).default(""),
  automationInterest: z.array(z.string().max(100)).max(10),
  concerns: z.array(z.string().max(100)).max(10),
  price: choice(["Less than ₦5,000","₦5,000–₦9,999","₦10,000–₦19,999","₦20,000–₦34,999","₦35,000 or more","Would not pay","Need to see product"]),
  followup: z.enum(["Yes","Maybe","No"]),
  contactName: z.string().trim().max(100).default(""),
  contactDetail: z.string().trim().max(150).default(""),
  contactPermission: z.boolean(),
  privacyAcknowledged: z.literal(true),
  website: z.string().max(200).default(""),
  turnstileToken: z.string().max(4096).default(""),
}).superRefine((data, ctx) => {
  if (data.followup !== "No" && data.contactPermission && !data.contactDetail) {
    ctx.addIssue({ code:"custom", path:["contactDetail"], message:"Provide a contact method or disable follow-up contact." });
  }
  if (data.followup === "No" && (data.contactPermission || data.contactDetail)) {
    ctx.addIssue({ code:"custom", path:["contactPermission"], message:"Contact details require follow-up permission." });
  }
});

export type ResearchSurveyInput = z.infer<typeof researchSurveySchema>;
