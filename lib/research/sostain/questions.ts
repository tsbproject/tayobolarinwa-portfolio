export const surveyVersion = "1.1-short";
export const researchSteps = [
  { id: "business", title: "About your business" },
  { id: "challenges", title: "Your biggest challenges" },
] as const;
export const businessCategories = [
  "Retail / Social commerce", "Wholesale / Distribution", "Branding / Printing",
  "Digital agency / IT services", "Professional / Consulting services",
  "Repairs / Maintenance", "Other services", "Other",
] as const;
export const challenges = [
  "Missed customer enquiries / follow-ups", "Preparing quotes and invoices",
  "Recording sales and expenses", "Tracking unpaid customer balances",
  "Confirming payments", "Inventory / stock control",
  "Knowing actual profit", "Other",
] as const;
export const channels = [
  "WhatsApp", "Phone calls", "Instagram / Facebook", "Walk-in visits",
  "Email / Website", "Other",
] as const;
export const trackingMethods = [
  "Notebook / Paper", "WhatsApp chats", "Excel / Google Sheets",
  "Business / Accounting software", "No consistent method", "Other",
] as const;
