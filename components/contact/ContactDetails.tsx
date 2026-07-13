import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const contacts = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@tayobolarinwa.dev",
    description: "Send me an email anytime.",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+234 XXX XXX XXXX",
    description: "Available for scheduled consultations.",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Lagos, Nigeria",
    description: "Working with clients worldwide.",
  },
  {
    icon: Clock,
    title: "Response Time",
    value: "Within 24 Hours",
    description: "Monday – Friday",
  },
];

export default function ContactDetails() {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Contact"
          title="Get In Touch"
          description="Reach out to discuss your project or schedule a consultation."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2">

          {contacts.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-8"
              >
                <Icon
                  className="text-blue-600"
                  size={28}
                />

                <h3 className="mt-6 text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 font-semibold">
                  {item.value}
                </p>

                <p className="mt-2 text-slate-600">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </Container>
    </Section>
  );
}