import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: ComponentProps<"h1">) => (
      <h1
        className="text-5xl font-semibold leading-tight tracking-[-0.03em] text-slate-950"
        {...props}
      />
    ),
    h2: (props: ComponentProps<"h2">) => (
      <h2
        className="mt-12 scroll-m-20 border-t border-slate-200 pt-8 text-2xl font-semibold tracking-tight text-slate-950"
        {...props}
      />
    ),
    h3: (props: ComponentProps<"h3">) => (
      <h3 className="mt-8 text-lg font-semibold text-slate-900" {...props} />
    ),
    p: (props: ComponentProps<"p">) => <p className="mt-4 leading-7 text-slate-600" {...props} />,
    ul: (props: ComponentProps<"ul">) => (
      <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600" {...props} />
    ),
    ol: (props: ComponentProps<"ol">) => (
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-600" {...props} />
    ),
    li: (props: ComponentProps<"li">) => <li className="leading-7" {...props} />,
    a: ({ href = "", ...props }: ComponentProps<"a">) => (
      <Link
        href={href}
        className="text-brand-500 font-medium underline underline-offset-4"
        {...props}
      />
    ),
    code: (props: ComponentProps<"code">) => (
      <code
        className="rounded bg-white px-1.5 py-0.5 font-mono text-sm text-slate-800 ring-1 ring-slate-200"
        {...props}
      />
    ),
    pre: (props: ComponentProps<"pre">) => (
      <pre
        className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 font-mono text-sm leading-6 text-slate-700 shadow-sm [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-slate-700 [&_code]:ring-0"
        {...props}
      />
    ),
    hr: (props: ComponentProps<"hr">) => <hr className="my-10 border-slate-200" {...props} />,
    strong: (props: ComponentProps<"strong">) => (
      <strong className="font-semibold text-slate-950" {...props} />
    ),
    blockquote: (props: ComponentProps<"blockquote">) => (
      <blockquote
        className="mt-5 rounded-2xl border border-slate-200 bg-[#f8fbff] px-4 py-3 text-slate-600"
        {...props}
      />
    ),
    ...components,
  };
}
