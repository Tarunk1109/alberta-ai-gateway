import { Globe2, Sun, Moon } from "lucide-react";

export default function Topbar({ dark, setDark, onOpenPanel }) {
  const items = [
    ["Plan", "plan"],
    ["XR", "xr"],
    ["Culture", "culture"],
    ["Trade", "trade"],
    ["Education", "education"],
    ["Sports", "sports"],
    ["Tourism", "tourism"],
  ];

  return (
    <header className={`sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-neutral-950/80 dark:border-neutral-900`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">Alberta AI Gateway</span>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {items.map(([label, key]) => (
            <button
              key={key}
              onClick={() => onOpenPanel(key)}
              className="px-3 py-1.5 rounded-full text-sm border hover:bg-gray-50 dark:hover:bg-neutral-900"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => onOpenPanel("chat")}
            className="px-3 py-1.5 rounded-full text-sm border hover:bg-gray-50 dark:hover:bg-neutral-900"
          >
            Chat
          </button>
        </nav>

        <button
          onClick={() => setDark((d) => !d)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50 dark:hover:bg-neutral-900"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {dark ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}
