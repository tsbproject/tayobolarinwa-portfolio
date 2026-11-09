import { notFound } from "next/navigation";
import type { Metadata } from "next";
import StagingAcceptanceClient from "./StagingAcceptanceClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {title:"Protected Sostain Staging Acceptance", robots:{index:false,follow:false}};

export default function StagingAcceptancePage() {
  const enabled = process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF === "feature/sostain-research-portal" &&
    process.env.SOSTAIN_STAGING_E2E_ENABLED === "true" &&
    process.env.SOSTAIN_SURVEY_BACKEND_READY === "false" &&
    process.env.NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN === "false";
  if (!enabled) notFound();
  return <StagingAcceptanceClient/>;
}
