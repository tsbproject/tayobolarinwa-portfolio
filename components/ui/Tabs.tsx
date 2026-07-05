"use client";

import { useState } from "react";
import clsx from "clsx";

export type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  tabs: TabItem[];
};

export default function Tabs({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  const active = tabs.find(
    (tab) => tab.id === activeTab
  );

  return (
    <div>

      {/* Navigation */}

      <div className="mb-10 flex flex-wrap gap-3 border-b border-slate-200 pb-4">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "rounded-xl px-5 py-3 text-sm font-semibold transition",

              activeTab === tab.id
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {tab.label}
          </button>

        ))}

      </div>

      {/* Content */}

      <div>

        {active?.content}

      </div>

    </div>
  );
}