import { notFound } from "next/navigation";
import TurnstileCheckClient from "@/components/research/sostain/TurnstileCheckClient";

export const metadata = { title: "Local Turnstile Check", robots: { index: false, follow: false } };

export default function TurnstileCheckPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <TurnstileCheckClient />;
}
