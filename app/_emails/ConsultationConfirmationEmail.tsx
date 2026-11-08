import { Button, Hr, Text } from "@react-email/components";
import PortfolioEmailLayout from "./PortfolioEmailLayout";

interface Props { fullName: string; }

export default function ConsultationConfirmationEmail({fullName}: Props) {
  return <PortfolioEmailLayout
    preview="Your consultation request has been received — Tayo Bolarinwa"
    eyebrow="Portfolio · Consultation"
    title="Thank you for reaching out"
  >
    <Text style={{fontSize:"19px",fontWeight:700,color:"#0f172a",margin:"0 0 18px"}}>
      Hello {fullName},
    </Text>
    <Text style={{fontSize:"15px",lineHeight:"26px",color:"#334155",margin:"0 0 16px"}}>
      Your consultation request has been received successfully. Thank you for sharing
      the details of your project with me.
    </Text>
    <Text style={{fontSize:"15px",lineHeight:"26px",color:"#334155",margin:"0 0 24px"}}>
      I&apos;ll personally review your submission and aim to respond within
      <strong> 24 hours</strong>.
    </Text>
    <Hr style={{borderColor:"#e2e8f0",margin:"20px 0 24px"}}/>
    <Text style={{fontSize:"16px",fontWeight:700,color:"#0f172a",margin:"0 0 10px"}}>
      Explore selected engineering work
    </Text>
    <Text style={{fontSize:"14px",lineHeight:"24px",color:"#475569",margin:"0 0 20px"}}>
      In the meantime, you can explore recent product engineering projects and case studies.
    </Text>
    <Button
      href="https://tayobolarinwa.dev/products"
      style={{
        display:"inline-block",backgroundColor:"#2563eb",color:"#ffffff",
        padding:"14px 22px",fontSize:"14px",fontWeight:700,
        textDecoration:"none",borderRadius:"8px",
      }}
    >View my projects</Button>
    <Text style={{fontSize:"14px",lineHeight:"24px",color:"#475569",margin:"26px 0 0"}}>
      Best regards,<br/>
      <strong style={{color:"#0f172a"}}>Tayo Bolarinwa</strong><br/>
      Full Stack Engineer
    </Text>
  </PortfolioEmailLayout>;
}
