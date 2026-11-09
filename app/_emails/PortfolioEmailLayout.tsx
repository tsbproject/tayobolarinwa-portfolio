import type { ReactNode } from "react";
import {
  Body, Container, Head, Html, Img, Link, Preview, Section, Text,
} from "@react-email/components";

/**
 * Shared, table-based and inline-styled email chrome for tayobolarinwa.dev.
 * Email clients do not load app/globals.css, Tailwind classes or Next.js fonts.
 * The logo uses the existing portfolio asset, not a recreated brandmark.
 */
export default function PortfolioEmailLayout({
  preview, eyebrow, title, children,
}: {
  preview: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{
        backgroundColor: "#f1f5f9", margin: "0", padding: "32px 12px",
        fontFamily: "Arial, Helvetica, sans-serif", color: "#0f172a",
      }}>
        <Container style={{
          width: "100%", maxWidth: "600px", margin: "0 auto",
          border: "1px solid #e2e8f0", backgroundColor: "#ffffff",
        }}>
          <Section style={{backgroundColor:"#0f172a", padding:"26px 30px"}}>
            {/* The original logo contains dark lettering; preserve it on a light tile. */}
            <Section style={{
              backgroundColor:"#ffffff",
              width:"164px",
              padding:"12px 16px",
              borderRadius:"8px",
              margin:"0 0 22px",
            }}>
              <Img
                src="https://tayobolarinwa.dev/images/logo/tsb-logo.png"
                alt="Tayo Bolarinwa"
                width="132"
                style={{display:"block",width:"132px",height:"auto",margin:"0"}}
              />
            </Section>
            <Text style={{
              color:"#93c5fd",fontSize:"11px",letterSpacing:"2px",
              fontWeight:700,textTransform:"uppercase",margin:"0 0 8px",
            }}>{eyebrow}</Text>
            <Text style={{
              color:"#ffffff",fontSize:"25px",lineHeight:"34px",
              fontWeight:700,margin:"0",
            }}>{title}</Text>
          </Section>
          <Section style={{padding:"30px"}}>
            {children}
          </Section>
          <Section style={{
            backgroundColor:"#f8fafc",borderTop:"1px solid #e2e8f0",
            padding:"22px 30px",
          }}>
            <Text style={{margin:"0 0 8px",fontSize:"14px",fontWeight:700,color:"#0f172a"}}>
              Tayo Bolarinwa
            </Text>
            <Text style={{margin:"0 0 12px",fontSize:"12px",lineHeight:"20px",color:"#475569"}}>
              Full Stack Engineer · Building scalable digital products
            </Text>
            <Text style={{margin:"0",fontSize:"12px",lineHeight:"20px"}}>
              <Link href="https://tayobolarinwa.dev" style={{color:"#2563eb",textDecoration:"underline"}}>Portfolio</Link>
              {"  ·  "}
              <Link href="https://tayobolarinwa.dev/products" style={{color:"#2563eb",textDecoration:"underline"}}>Case studies</Link>
              {"  ·  "}
              <Link href="https://tayobolarinwa.dev/consultation" style={{color:"#2563eb",textDecoration:"underline"}}>Consultation</Link>
            </Text>
            <Text style={{margin:"16px 0 0",color:"#94a3b8",fontSize:"11px"}}>
              Sent from tayobolarinwa.dev · Lagos, Nigeria
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
