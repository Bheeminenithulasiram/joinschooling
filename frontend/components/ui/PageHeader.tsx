export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="relative overflow-hidden border-b border-slate-200 bg-hero-glow">
      <div className="container-page py-14">
        {eyebrow && <div className="chip-brand mb-3">{eyebrow}</div>}
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-ink-500">{subtitle}</p>}
      </div>
    </div>
  );
}
