import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  fullName: string;
}

export default function ConsultationConfirmationEmail({
  fullName,
}: Props) {
  return (
    <Html>
      <Head />

      <Preview>
        Thank you for contacting Tayo Bolarinwa
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
            Thank You, {fullName} 👋
          </Heading>

          <Text>
            Your consultation request has been
            received successfully.
          </Text>

          <Text>
            Thank you for taking the time to
            share your project with me.
          </Text>

          <Text>
            I&apos;ll personally review your
            submission and get back to you
            within <strong>24 hours</strong>.
          </Text>

          <Hr />

          <Section>

            <Heading
              as="h2"
              style={{
                fontSize: 18,
              }}
            >
              While You Wait
            </Heading>

            <Text>
              You can explore some of my recent
              engineering work:
            </Text>

            <Button
              href="https://tayobolarinwa.dev/products"
              style={{
                background: "#2563eb",
                color: "#ffffff",
                padding:
                  "14px 24px",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              View My Projects
            </Button>

          </Section>

          <Hr />

          <Text
            style={{
              color: "#64748b",
            }}
          >
            Tayo Bolarinwa
            <br />
            Product Engineer
            <br />
            Lagos, Nigeria
          </Text>

        </Container>
      </Body>
    </Html>
  );
}