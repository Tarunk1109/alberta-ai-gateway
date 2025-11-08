export default function SectionBody({ section }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        {section.bullets.map((b, i) => (
          <p key={i} className="text-base leading-relaxed">• {b}</p>
        ))}
      </div>
      <div className="space-y-3">
        <div className="p-4 rounded-xl border bg-white dark:bg-neutral-950">
          <h3 className="font-semibold mb-2">Learn More</h3>
          <div className="flex flex-wrap gap-3">
            {section.links.map((l, i) => (
              <a key={i} className="underline text-blue-600 hover:opacity-80" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-white dark:bg-neutral-950">
          <h3 className="font-semibold mb-2">XR Peek</h3>
          <model-viewer
            src="/banff.glb"
            auto-rotate
            camera-controls
            poster="/banff-placeholder.jpg"
            style={{ width: "100%", height: "260px", borderRadius: "12px" }}
          ></model-viewer>
        </div>
      </div>
    </div>
  );
}
