export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="fh-skel fh-skel-title" />
      </div>
      <div className="fh-skel fh-skel-line mb-6" />

      <div className="mb-8 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="fh-skel fh-skel-stat" />
        ))}
      </div>

      <div className="fh-skel fh-skel-panel" />
    </div>
  );
}
