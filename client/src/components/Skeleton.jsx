export default function Skeleton({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 rounded bg-gray-200 dark:bg-neutral-800" />
      ))}
    </div>
  );
}
