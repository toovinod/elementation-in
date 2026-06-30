export function DemoForm() {
  return (
    <section
      data-elementation-component="DemoForm"
      data-elementation-file="components/playground/demo-form.tsx"
      data-elementation-line="3"
      className="contact border-t px-6 py-16"
    >
      <div className="mx-auto max-w-md">
        <h2 className="text-center text-2xl font-semibold tracking-tight">Stay in the loop</h2>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          Subscribe for product updates. No spam.
        </p>
        <form className="mt-6 space-y-3" onSubmit={(event) => event.preventDefault()}>
          <input
            className="email-input h-10 w-full rounded-md border bg-transparent px-3 text-sm"
            type="email"
            placeholder="you@company.com"
          />
          <textarea
            className="message-input min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            placeholder="Anything you'd like to see?"
          />
          <button
            className="submit-button bg-primary text-primary-foreground h-10 w-full rounded-md text-sm font-medium"
            type="submit"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
