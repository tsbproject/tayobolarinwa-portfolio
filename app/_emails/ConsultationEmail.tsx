import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import type { ConsultationInput } from "@/app/_lib/validation/consultation";

interface Props {
  data: ConsultationInput;
}

export default function ConsultationEmail({
  data,
}: Props) {
  return (
    <Html>

      <Head />

      <Preview>
        New consultation request from {data.fullName}
      </Preview>

      <Body
        style={{
          backgroundColor: "#f8fafc",
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >

        <Container
          style={{
            background: "#ffffff",
            margin: "40px auto",
            padding: "40px",
            borderRadius: "16px",
            maxWidth: "680px",
          }}
        >

          <Heading>
            New Consultation Request
          </Heading>

          <Text>
            A new consultation request has
            been submitted through your
            portfolio website.
          </Text>

          <Hr />

          <Section>

            <Heading
              as="h2"
              style={{ fontSize: 18 }}
            >
              Client Information
            </Heading>

            <Text>
              <strong>Name:</strong>{" "}
              {data.fullName}
            </Text>

            <Text>
              <strong>Email:</strong>{" "}
              {data.email}
            </Text>

            <Text>
              <strong>Company:</strong>{" "}
              {data.company || "N/A"}
            </Text>

            <Text>
              <strong>Phone:</strong>{" "}
              {data.phone || "N/A"}
            </Text>

          </Section>

          <Hr />

          <Section>

            <Heading
              as="h2"
              style={{ fontSize: 18 }}
            >
              Project Details
            </Heading>

            <Text>
              <strong>Project Type:</strong>{" "}
              {data.projectType}
            </Text>

            <Text>
              <strong>Project Stage:</strong>{" "}
              {data.projectStage}
            </Text>

            <Text>
              <strong>Budget:</strong>{" "}
              {data.budget}
            </Text>

            <Text>
              <strong>Estimated Start:</strong>{" "}
              {data.startDate}
            </Text>

            <Text>
              <strong>Preferred Contact:</strong>{" "}
              {data.preferredContact}
            </Text>

          </Section>

          <Hr />

          <Section>

            <Heading
              as="h2"
              style={{ fontSize: 18 }}
            >
              Project Description
            </Heading>

            <Text>
              {data.message}
            </Text>

          </Section>

        </Container>

      </Body>

    </Html>
  );
}