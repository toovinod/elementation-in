export function DemoHero() {
  return (
    <section
      data-elementation-component="DemoHero"
      data-elementation-file="components/playground/demo-hero.tsx"
      data-elementation-line="3"
      className="hero mx-auto max-w-3xl px-6 py-20 text-center"
    >
      <span className="badge text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
        New · v2.0
      </span>
      <h1 className="hero-title mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
        Build something people love
      </h1>
      <p className="hero-subtitle text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
        A realistic starter UI you can inspect with Elementation. Turn on Inspect, then click any
        element to capture it.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button className="primary-cta bg-primary text-primary-foreground rounded-md px-6 py-3 text-base font-medium">
          Get Started
        </button>
        <button className="secondary-cta rounded-md border px-6 py-3 text-base font-medium">
          Live demo
        </button>
      </div>
    </section>
  );
}
