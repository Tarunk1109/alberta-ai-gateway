import { useState, useEffect } from "react";

// simple classnames helper (avoid extra deps)
function cn(...a) { return a.filter(Boolean).join(" "); }

/**
 * Props:
 * - items: [{ key, title, points[], links[] }]
 * - activeKey (optional): externally controlled active
 * - onChange(key) (optional): notify parent on tab change
 */
export default function Tabs({ items, activeKey, onChange }) {
  const [active, setActive] = useState(activeKey || items[0]?.key);

  useEffect(() => {
    if (activeKey && activeKey !== active) setActive(activeKey);
  }, [activeKey]); // eslint-disable-line

  const setTab = (k) => {
    setActive(k);
    onChange?.(k);
  };

  const activeItem = items.find(i => i.key === active) || items[0];

  return (
    <section id="info" className="p-4 rounded-xl border bg-white dark:bg-neutral-900">
      <div className="flex flex-wrap gap-2 mb-3">
        {items.map(it => {
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              onClick={() => setTab(it.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm border transition",
                isActive
                  ? "bg-gray-900 text-white dark:bg-white dark:text-black"
                  : "hover:bg-gray-50 dark:hover:bg-neutral-800"
              )}
              aria-pressed={isActive}
            >
              {it.title}
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {activeItem?.points?.map((p, idx) => (
          <p key={idx} className="text-sm leading-relaxed">• {p}</p>
        ))}
        <div className="flex flex-wrap gap-3 mt-2">
          {activeItem?.links?.map((l, idx) => (
            <a
              key={idx}
              className="underline text-blue-600 text-sm hover:opacity-80"
              href={l.href}
              target="_blank"
              rel="noreferrer"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
