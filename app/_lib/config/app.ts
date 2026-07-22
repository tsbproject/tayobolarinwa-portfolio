export const AppConfig = {
  name: "Tayo Bolarinwa",

  email:
    process.env.CONSULTATION_EMAIL ??
    "tsbolarinwa@gmail.com",

  sender:
    process.env.FROM_EMAIL ??
    "Portfolio <onboarding@resend.dev>",
} as const;