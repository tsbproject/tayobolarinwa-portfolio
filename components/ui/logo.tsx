import clsx from "clsx";
import Image from "next/image";

type LogoProps = {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg" | "xl" ;
  priority?: boolean;
  className?: string;
};

const sizes = {
  sm: 36,
  md: 48,
  lg: 64,
  xl: 100,
};

export default function Logo({
  variant = "icon",
  size = "xl",
  priority = false,
  className,
}: LogoProps) {
  const dimension = sizes[size];

  return (
    <Image
      src={
        variant === "icon"
          ? "/images/logo/tsb-logo.png"
          : "/images/logo/logo-full.png"
      }
      alt="Tayo Bolarinwa"
      width={dimension}
      height={dimension}
      priority={priority}
      className={clsx(className)}
    />
  );
}