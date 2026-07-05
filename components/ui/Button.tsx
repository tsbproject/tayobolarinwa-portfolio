import Link from "next/link";
import clsx from "clsx";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  const styles = clsx(
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300",
    {
      "bg-slate-900 text-white hover:bg-blue-600":
        variant === "primary",

      "border border-slate-300 bg-white text-slate-900 hover:border-slate-900":
        variant === "secondary",
    },
    className
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return <button className={styles}>{children}</button>;
}