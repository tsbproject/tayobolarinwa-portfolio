import clsx from "clsx";
import { ReactNode } from "react";

type InfoCardProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export default function InfoCard({
  label,
  value,
  className,
}: InfoCardProps) {
  return (
    <div
      className={clsx(
        "group h-full rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
        {label}
      </p>

      <div className="mt-5 text-base leading-8 text-slate-700">
        {value}
      </div>
    </div>
  );
}