"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

type Props = {
  items: AccordionItem[];
};

export default function Accordion({
  items,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">

      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <div
            key={item.title}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >

            <button
              onClick={() =>
                setOpenIndex(open ? null : index)
              }
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <h3 className="text-lg font-semibold">
                {item.title}
              </h3>

              <ChevronDown
                className={clsx(
                  "transition duration-300",
                  open && "rotate-180"
                )}
                size={22}
              />
            </button>

            {open && (
              <div className="border-t border-slate-200 px-6 py-6 text-slate-600 leading-8">
                {item.content}
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}