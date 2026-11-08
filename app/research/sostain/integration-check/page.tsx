import { notFound } from "next/navigation";
import TurnstileCheckClient from "@/components/research/sostain/TurnstileCheckClient";

export const metadata = { title: "Sostain Local Security Integration Check", robots: { index: false, follow: false } };

export default function IntegrationCheckPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <TurnstileCheckClient combined />;
}
