import { Hr, Section, Text } from "@react-email/components";
import type { ConsultationInput } from "@/app/_lib/validation/consultation";
import PortfolioEmailLayout from "./PortfolioEmailLayout";

interface Props { data: ConsultationInput; }
const labelStyle = {fontSize:"12px",fontWeight:700 as const,color:"#64748b",margin:"0 0 5px"};
const valueStyle = {fontSize:"15px",lineHeight:"23px",color:"#0f172a",margin:"0"};
const headingStyle = {fontSize:"16px",lineHeight:"24px",fontWeight:700 as const,color:"#0f172a",margin:"0 0 18px"};

function Detail({label,value}:{label:string;value:string}) {
  return <Section style={{marginBottom:"16px"}}>
    <Text style={labelStyle}>{label}</Text>
    <Text style={valueStyle}>{value || "Not provided"}</Text>
  </Section>;
}

export default function ConsultationEmail({data}: Props) {
  return <PortfolioEmailLayout
    preview={`New consultation request from ${data.fullName}`}
    eyebrow="Portfolio · New enquiry"
    title="New Consultation Request"
  >
    <Text style={{fontSize:"15px",lineHeight:"25px",color:"#475569",margin:"0 0 24px"}}>
      A new project consultation has been submitted through your portfolio.
      The enquiry details are below.
    </Text>
    <Section style={{borderLeft:"3px solid #2563eb",paddingLeft:"16px",marginBottom:"24px"}}>
      <Text style={{fontSize:"12px",color:"#64748b",fontWeight:700,margin:"0 0 6px"}}>CONTACT</Text>
      <Text style={{fontSize:"19px",fontWeight:700,color:"#0f172a",margin:"0"}}>{data.fullName}</Text>
      <Text style={{fontSize:"14px",color:"#2563eb",margin:"8px 0 0"}}>{data.email}</Text>
    </Section>
    <Hr style={{borderColor:"#e2e8f0",margin:"24px 0"}}/>
    <Text style={headingStyle}>Client information</Text>
    <Detail label="Company" value={data.company || "N/A"}/>
    <Detail label="Phone" value={data.phone || "N/A"}/>
    <Hr style={{borderColor:"#e2e8f0",margin:"24px 0"}}/>
    <Text style={headingStyle}>Project details</Text>
    <Detail label="Project type" value={data.projectType}/>
    <Detail label="Project stage" value={data.projectStage}/>
    <Detail label="Budget" value={data.budget}/>
    <Detail label="Estimated start" value={data.startDate}/>
    <Detail label="Preferred contact" value={data.preferredContact}/>
    <Hr style={{borderColor:"#e2e8f0",margin:"24px 0"}}/>
    <Text style={headingStyle}>Project description</Text>
    <Text style={{fontSize:"15px",lineHeight:"25px",color:"#334155",whiteSpace:"pre-wrap",overflowWrap:"break-word",margin:"0"}}>
      {data.message}
    </Text>
  </PortfolioEmailLayout>;
}
