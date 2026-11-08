import ResearchAdminClient from "@/components/research/sostain/ResearchAdminClient";

export const metadata = {
  title: "Sostain Research Administration",
  robots: { index: false, follow: false },
};

export default function ResearchAdminPage() {
  // No private data is loaded in this page. All reads are authorized per API call.
  return <ResearchAdminClient/>;
}
