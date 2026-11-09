import type { Metadata } from "next";
import SostainSurvey from "@/components/research/sostain/SostainSurvey";

export const metadata: Metadata = {
  title: "Nigerian SME Business Operations Survey | Sostain Research",
  description: "Share how your business handles sales, customer enquiries, expenses and payments in a voluntary Sostain research study.",
  robots: { index: false, follow: false },
};

export default function SostainResearchPage() {
  return <SostainSurvey />;
}
