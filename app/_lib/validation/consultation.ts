import { z } from "zod";
import { SECURITY } from "../constants/security";

export const consultationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required."),

  email: z
    .email("Please enter a valid email address."),

  company: z
    .string()
    .trim()
    .max(100)
    .optional(),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional(),

  projectType: z
    .string()
    .min(1, "Please select a project type."),

  projectStage: z
    .string()
    .min(1, "Please select a project stage."),

  budget: z
    .string()
    .min(1, "Please select your budget."),

  startDate: z
    .string()
    .min(1, "Please select an estimated start date."),

  preferredContact: z
    .string()
    .min(1, "Please select a preferred contact method."),

  message: z
    .string()
    .trim()
    .min(
      SECURITY.MIN_MESSAGE_LENGTH,
      `Message must be at least ${SECURITY.MIN_MESSAGE_LENGTH} characters.`
    )
    .max(
      SECURITY.MAX_MESSAGE_LENGTH,
      `Message cannot exceed ${SECURITY.MAX_MESSAGE_LENGTH} characters.`
    ),

  website: z.string().optional(),
});

export type ConsultationInput = z.infer<
  typeof consultationSchema
>;