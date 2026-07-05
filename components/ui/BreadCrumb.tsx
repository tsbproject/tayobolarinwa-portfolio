import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({
  items,
}: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-10"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <li>
          <Link
            href="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>
        </li>

        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2"
          >
            <ChevronRight size={16} />

            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-blue-600"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}