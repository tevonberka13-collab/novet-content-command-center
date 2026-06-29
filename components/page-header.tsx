export function PageHeader({
  eyebrow,
  title,
  description,
  bordered = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  bordered?: boolean;
}) {
  return (
    <header className={bordered ? "border-b border-[var(--line)] pb-8" : ""}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="font-display mt-3 text-5xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{description}</p>
    </header>
  );
}
