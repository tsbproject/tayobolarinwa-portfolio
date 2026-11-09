import { z } from "zod";
import { businessCategories, challenges, channels, surveyVersion, trackingMethods } from "./questions";

export const researchSurveySchema = z.object({
  surveyVersion: z.literal(surveyVersion),
  submissionId: z.uuid(),
  category: z.enum(businessCategories),
  teamSize: z.enum(["Just me","2–5","6–20","More than 20"]),
  mainChannel: z.enum(channels),
  tracking: z.enum(trackingMethods),
  challenges: z.array(z.enum(challenges)).min(1,"Choose at least one challenge.").max(2,"Choose no more than two challenges."),
  challengeFrequency: z.enum(["Daily","Weekly","Occasionally","Rarely"]),
  price: z.enum(["Under ₦5,000","₦5,000–₦14,999","₦15,000 or more","Not sure / Need to see it","Would not pay"]),
  followup: z.enum(["Yes","No"]),
  contactName: z.string().trim().max(100).default(""),
  contactDetail: z.string().trim().max(150).default(""),
  contactPermission: z.boolean(),
  privacyAcknowledged: z.literal(true),
  website: z.string().max(200).default(""),
  turnstileToken: z.string().max(4096).default(""),
}).superRefine((data, ctx) => {
  if (data.followup === "No" && (data.contactPermission || data.contactName || data.contactDetail)) {
    ctx.addIssue({ code:"custom", path:["followup"], message:"Contact details require choosing Yes for interview follow-up." });
  }
  if (data.followup === "Yes" && data.contactDetail && !data.contactPermission) {
    ctx.addIssue({ code:"custom", path:["contactPermission"], message:"Please allow contact or clear your contact details." });
  }
  if (data.contactPermission && !data.contactDetail) {
    ctx.addIssue({ code:"custom", path:["contactDetail"], message:"Provide an email or WhatsApp contact." });
  }
});
export type ResearchSurveyInput = z.infer<typeof researchSurveySchema>;
