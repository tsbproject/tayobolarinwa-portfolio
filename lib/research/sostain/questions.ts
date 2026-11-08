export const surveyVersion = "1.0";
export const researchSteps = [
  { id: "profile", title: "Your business" },
  { id: "sales", title: "Customers and sales" },
  { id: "finance", title: "Finance and payments" },
  { id: "challenges", title: "Business challenges" },
  { id: "adoption", title: "Technology and follow-up" },
] as const;

export const businessCategories = [
  "Retail / Social commerce", "Wholesale / Distribution",
  "Branding / Printing", "Digital agency / IT services",
  "Professional / Consulting services", "Repairs / Maintenance",
  "Other services", "Other",
] as const;

export const challenges = [
  "Responding to enquiries", "Following up potential customers",
  "Preparing quotations and invoices", "Recording sales and expenses",
  "Tracking outstanding payments", "Confirming customer payments",
  "Inventory management", "Understanding profitability",
  "Coordinating employees", "Other",
] as const;

export const channels = [
  "WhatsApp", "Phone calls", "Instagram / Facebook", "Email",
  "Walk-in visits", "Website", "Other",
] as const;
