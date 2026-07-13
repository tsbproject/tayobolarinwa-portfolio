import ConsultationHero from "@/components/consultation/ConsultationHero";
import ConsultationServices from "@/components/consultation/ConsultationService";
import ConsultationProcess from "@/components/consultation/ConsultationProcess";
import ContactForm from "@/components/contact/ContactForm";

export default function ConsultationPage() {
  return (
    <>
      <ConsultationHero />
      <ConsultationServices />
      <ConsultationProcess />
      <ContactForm />
    </>
  );
}