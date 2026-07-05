import clsx from "clsx";

export type TimelineItem = {
  title: string;
  description: string;
  date?: string;
  status?: "completed" | "current" | "planned";
};

type Props = {
  items: TimelineItem[];
};

export default function Timeline({ items }: Props) {
  return (
    <div className="relative border-l-2 border-slate-200 pl-8">

      {items.map((item, index) => (

        <div
          key={index}
          className="relative mb-12 last:mb-0"
        >
          <span
            className={clsx(
              "absolute -left-[42px] h-5 w-5 rounded-full border-4",

              item.status === "completed" &&
                "border-green-600 bg-green-600",

              item.status === "current" &&
                "border-blue-600 bg-blue-600",

              item.status === "planned" &&
                "border-slate-400 bg-white"
            )}
          />

          {item.date && (
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              {item.date}
            </p>
          )}

          <h3 className="text-2xl font-bold">
            {item.title}
          </h3>

          <p className="mt-3 leading-8 text-slate-600">
            {item.description}
          </p>

        </div>

      ))}

    </div>
  );
}