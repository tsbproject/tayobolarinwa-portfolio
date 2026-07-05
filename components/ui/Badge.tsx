import clsx from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success";
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold",
        {
          "bg-blue-50 text-blue-700": variant === "default",
          "bg-emerald-50 text-emerald-700": variant === "success",
        },
        className
      )}
    >
      {children}
    </span>
  );
}