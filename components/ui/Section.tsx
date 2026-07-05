import clsx from "clsx";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Section({
  children,
  className,
}: SectionProps) {
  return (
    <section className={clsx("section", className)}>
      {children}
    </section>
  );
}