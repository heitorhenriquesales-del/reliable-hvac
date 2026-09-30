"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const items = [
  {
    title: "SINCE 2018",
    description: "From Reliable Construct to Reliable HVAC.",
    more: "The company’s roots date to 2018, carrying Reliable Construct’s experience into heating and cooling work.",
  },
  {
    title: "OWNER-OPERATED",
    description: "Every project is personally backed by the owner.",
    more: "That personal involvement brings direct oversight and accountability to every project.",
  },
  {
    title: "QUALITY YOU CAN COUNT ON",
    description: "Honest recommendations, attention to detail, and workmanship built to last.",
    more: "The focus is on thoughtful recommendations and careful work that supports dependable comfort over time.",
  },
];

export function Principles() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="principles">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `principle-detail-${i + 1}`;

        return (
          <div key={item.title} data-reveal className={isOpen ? "principle-row is-open" : "principle-row"}>
            <span>0{i + 1}</span>
            <div className="principle-copy">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div
                className="principle-extra"
                id={panelId}
                aria-hidden={!isOpen}
              >
                <div><p>{item.more}</p></div>
              </div>
            </div>
            <button
              type="button"
              className="principle-toggle"
              aria-label={`${isOpen ? "Show less about" : "More about"} ${item.title.toLowerCase()}`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <Plus size={22} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
